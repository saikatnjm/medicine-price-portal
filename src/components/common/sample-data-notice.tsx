interface SampleDataNoticeProps {
  className?: string;
}

/** States clearly that prices and availability are sample data, not live information. */
export function SampleDataNotice({ className = "" }: SampleDataNoticeProps) {
  return (
    <p
      role="note"
      className={`rounded-md border border-notice-200 bg-notice-50 px-3 py-2 text-sm text-notice-900 ${className}`}
    >
      <strong className="font-semibold">Sample data:</strong> prices and availability shown on this
      site are for demonstration only and are not live pharmacy information.
    </p>
  );
}
