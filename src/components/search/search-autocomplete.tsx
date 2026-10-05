"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { SuggestionGroup, SuggestionItem } from "@/domain/read-models";
import { routes } from "@/lib/routes";
import { SEARCH_MAX_QUERY_LENGTH, SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";

const DEBOUNCE_MS = 200;

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
  const reactId = useId();
  const listboxId = `${inputId}-listbox`;
  const [value, setValue] = useState(defaultValue);
  const [groups, setGroups] = useState<SuggestionGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState("");
  const typed = useRef(false);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const showList = open && flat.length > 0;

  useEffect(() => {
    if (!typed.current) return;
    const query = value.replace(/\s+/g, " ").trim();
    if (query.length < SEARCH_MIN_QUERY_LENGTH) {
      setGroups([]);
      setActiveIndex(-1);
      setStatus("");
      return;
    }
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
        setStatus(count > 0 ? `${count} suggestion${count === 1 ? "" : "s"} available` : "No suggestions");
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
  }, [value]);

  function go(item: SuggestionItem) {
    setOpen(false);
    // Full navigation keeps this component free of router context (and works in tests).
    window.location.assign(item.href);
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
        {open ? status : ""}
      </div>
      <div
        id={listboxId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-96 overflow-y-auto rounded-md border border-slate-300 bg-white py-1 shadow-md"
      >
        {showList &&
          groups.map((group, groupIndex) => {
            const headingId = `${inputId}-group-${reactId}-${groupIndex}`;
            return (
              <div key={group.type} role="group" aria-labelledby={headingId}>
                <p id={headingId} className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const active = index === activeIndex;
                  return (
                    <div
                      key={item.href}
                      id={`${inputId}-option-${index}`}
                      role="option"
                      aria-selected={active}
                      // Keep focus in the input while clicking an option.
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => go(item)}
                      className={`flex min-h-11 cursor-pointer flex-col justify-center px-3 py-1.5 ${active ? "bg-brand-50 outline outline-2 -outline-offset-2 outline-brand-600" : "hover:bg-slate-50"}`}
                    >
                      <span className="text-sm font-medium break-words text-slate-900">{item.label}</span>
                      {item.detail && <span className="text-xs break-words text-slate-600">{item.detail}</span>}
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
