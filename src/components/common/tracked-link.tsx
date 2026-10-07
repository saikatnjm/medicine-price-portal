"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { track, type AppEvent } from "@/lib/events";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Event sent on click (omit to track nothing). Keep it free of phone numbers, URLs and queries. */
  event?: AppEvent;
};

/** A plain anchor that reports a product event on click; every other anchor prop is passed through. */
export function TrackedLink({ event, onClick, ...props }: TrackedLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (event) track(event);
    onClick?.(e);
  }
  return <a {...props} onClick={handleClick} />;
}
