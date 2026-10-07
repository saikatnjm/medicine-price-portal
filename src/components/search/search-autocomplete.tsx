"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { SuggestionGroup, SuggestionItem } from "@/domain/read-models";
import { useLocale, useT } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import type { Translator } from "@/i18n/translate";
import { CategoryTile } from "@/components/ui/category-tile";
import { routes } from "@/lib/routes";
import { SEARCH_MAX_QUERY_LENGTH, SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";

const DEBOUNCE_MS = 200;

/** The suggest API is locale-free (English), so its fixed location labels are translated here. */
function suggestionDetail(t: Translator, item: SuggestionItem): string | undefined {
  if (item.type !== "location" || !item.detail) return item.detail;
  if (item.detail === "Division") return t("search.suggestions.division");
  if (item.detail === "District") return t("search.suggestions.district");
  if (item.detail === "Area") return t("search.suggestions.area");
  const district = /^Area · (.+)$/.exec(item.detail)?.[1];
  return district ? t("search.suggestions.areaIn", { district }) : item.detail;
}

interface SearchAutocompleteProps {
  /** Id of the <input>; the visible <label htmlFor> must point at it. */
  inputId: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Search input with grouped suggestions (ARIA 1.2 combobox with a listbox popup).
 * Progressive enhancement: without JavaScript it is a plain text input inside the
 * GET form. Enter on a highlighted suggestion opens it; otherwise the form submits.
 */
export function SearchAutocomplete({
  inputId,
  defaultValue = "",
  placeholder,
  className = "",
}: SearchAutocompleteProps) {
  const t = useT();
  const lang = useLocale();
  const reactId = useId();
  const listboxId = `${inputId}-listbox`;
  const [value, setValue] = useState(defaultValue);
  const [groups, setGroups] = useState<SuggestionGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState("");
  const typed = useRef(false);

  // Suggestions only apply to queries long enough to search; derived, not reset in an effect.
  const query = value.replace(/\s+/g, " ").trim();
  const tooShort = query.length < SEARCH_MIN_QUERY_LENGTH;
  const visibleGroups = useMemo(() => (tooShort ? [] : groups), [tooShort, groups]);
  const flat = useMemo(() => visibleGroups.flatMap((group) => group.items), [visibleGroups]);
  const showList = open && flat.length > 0;
  const liveStatus = tooShort ? "" : status;

  useEffect(() => {
    if (!typed.current || tooShort) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${routes.suggestApi()}?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("suggest failed");
        const data = (await response.json()) as { groups?: SuggestionGroup[] };
        const next = Array.isArray(data.groups) ? data.groups : [];
        const count = next.reduce((sum, group) => sum + group.items.length, 0);
        setGroups(next);
        setActiveIndex(-1);
        setStatus(
          count > 0
            ? t(count === 1 ? "search.suggestions.available.one" : "search.suggestions.available.other", { n: count })
            : t("search.suggestions.none"),
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        // Suggestions are optional: fall back to the plain form.
        setGroups([]);
        setStatus("");
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tooShort, t]);

  function go(item: SuggestionItem) {
    setOpen(false);
    // Full navigation keeps this component free of router context (and works in tests).
    window.location.assign(localizePath(item.href, lang));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        if (flat.length === 0) return;
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) => (index + 1) % flat.length);
        break;
      case "ArrowUp":
        if (flat.length === 0) return;
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) => (index <= 0 ? flat.length - 1 : index - 1));
        break;
      case "Enter": {
        const item = showList ? flat[activeIndex] : undefined;
        if (item) {
          event.preventDefault();
          go(item);
        }
        break; // otherwise the form submits normally
      }
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
        break;
    }
  }

  let optionIndex = -1;
  return (
    <div
      className="relative min-w-0 flex-1"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <input
        id={inputId}
        type="search"
        name="q"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={showList && activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined}
        value={value}
        onChange={(event) => {
          typed.current = true;
          setValue(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        maxLength={SEARCH_MAX_QUERY_LENGTH}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className={className}
      />
      <div role="status" aria-live="polite" className="sr-only">
        {open ? liveStatus : ""}
      </div>
      <div
        id={listboxId}
        role="listbox"
        aria-label={t("search.suggestions.aria")}
        hidden={!showList}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg"
      >
        {showList &&
          visibleGroups.map((group, groupIndex) => {
            const headingId = `${inputId}-group-${reactId}-${groupIndex}`;
            return (
              <div key={group.type} role="group" aria-labelledby={headingId}>
                <p id={headingId} className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  {t(`search.group.${group.type}` as const)}
                </p>
                {group.items.map((item) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const active = index === activeIndex;
                  const detail = suggestionDetail(t, item);
                  return (
                    <div
                      key={item.href}
                      id={`${inputId}-option-${index}`}
                      role="option"
                      aria-selected={active}
                      // Keep focus in the input while clicking an option.
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => go(item)}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 px-3 py-1.5 ${active ? "bg-mist outline outline-2 -outline-offset-2 outline-brand-600" : "hover:bg-slate-50"}`}
                    >
                      <CategoryTile type={item.type} size="sm" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium break-words text-slate-900">{item.label}</span>
                        {detail && <span className="text-xs break-words text-slate-600">{detail}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
