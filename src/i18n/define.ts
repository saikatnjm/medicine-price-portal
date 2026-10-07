/** English and Bangla tables must have exactly the same keys (checked by the compiler). */
export function defineMessages<K extends string>(messages: { en: Record<K, string>; bn: Record<K, string> }) {
  return messages;
}
