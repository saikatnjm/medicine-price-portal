"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "./config";
import { useLocale } from "./client";

/** Drop-in replacement for next/link that keeps the visitor in the current language. */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLocale();
  return <NextLink href={typeof href === "string" ? localizePath(href, lang) : href} {...props} />;
}
