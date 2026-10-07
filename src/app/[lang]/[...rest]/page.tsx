import { notFound } from "next/navigation";

/** Unknown paths render the localised not-found page (the root layout lives under [lang]). */
export default function UnknownPage() {
  notFound();
}
