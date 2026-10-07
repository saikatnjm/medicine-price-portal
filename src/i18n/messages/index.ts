import { layout } from "./layout";
import { home } from "./home";
import { search } from "./search";
import { directory } from "./directory";
import { facility } from "./facility";
import { doctor } from "./doctor";
import { medicine } from "./medicine";
import { pharmacy } from "./pharmacy";
import { location } from "./location";
import { specialty } from "./specialty";
import { retention } from "./retention";
import { common } from "./common";
import { ui } from "./ui";
import { pages } from "./pages";
import { seo } from "./seo";

const DOMAINS = [layout, home, search, directory, facility, doctor, medicine, pharmacy, location, specialty, retention, common, ui, pages, seo] as const;

type Domains = (typeof DOMAINS)[number];
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

/** Every message key, e.g. "home.title". */
export type MessageKey = keyof UnionToIntersection<Domains["en"]> & string;

function merge(lang: "en" | "bn"): Record<MessageKey, string> {
  return Object.assign({}, ...DOMAINS.map((d) => d[lang])) as Record<MessageKey, string>;
}

export const MESSAGES = { en: merge("en"), bn: merge("bn") } as const;
