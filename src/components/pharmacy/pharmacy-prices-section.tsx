import { SectionHeading } from "@/components/common/section-heading";
import { SampleDataNotice } from "@/components/common/sample-data-notice";
import type { PharmacyDetail } from "@/domain/read-models";
import { PharmacyPriceList } from "./pharmacy-price-list";

/** Price list when records exist; otherwise an honest "not available yet" line. */
export function PharmacyPricesSection({ detail }: { detail: PharmacyDetail }) {
  if (detail.prices.length > 0) {
    return (
      <div className="space-y-4">
        {detail.hasSampleData && <SampleDataNotice />}
        <PharmacyPriceList prices={detail.prices} hasSampleData={detail.hasSampleData} />
      </div>
    );
  }
  return (
    <section aria-labelledby="pharmacy-prices">
      <SectionHeading id="pharmacy-prices">Medicine prices</SectionHeading>
      <p className="text-slate-700">
        Price information is not available yet for this pharmacy. Prices and stock are not shown until a reliable source
        exists; call the pharmacy to ask.
      </p>
    </section>
  );
}
