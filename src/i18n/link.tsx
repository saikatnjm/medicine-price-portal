"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "./config";
import { useLocale } from "./client";

/**
 * Drop-in replacement for next/link that keeps the visitor in the current language.
 *
 * Prefetching is off by default: list pages carry hundreds of links, and viewport prefetching
 * turned every visit (including JS-rendering crawlers) into hundreds of ISR reads/writes on
 * Vercel. Pages still load on click; pass `prefetch` explicitly to opt a link back in.
 */
export default function Link({ href, prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLocale();
  return <NextLink href={typeof href === "string" ? localizePath(href, lang) : href} prefetch={prefetch} {...props} />;
}
