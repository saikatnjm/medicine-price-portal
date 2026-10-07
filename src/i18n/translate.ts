import { DEFAULT_LOCALE, type Locale } from "./config";
import { MESSAGES, type MessageKey } from "./messages";

export type Vars = Record<string, string | number>;
export type Translator = (key: MessageKey, vars?: Vars) => string;

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Looks a message up in the language, falling back to English, then to the key itself. */
export function createT(lang: Locale): Translator {
  const table: Record<string, string> = MESSAGES[lang];
  const fallback: Record<string, string> = MESSAGES[DEFAULT_LOCALE];
  return (key, vars) => interpolate(table[key] ?? fallback[key] ?? key, vars);
}
