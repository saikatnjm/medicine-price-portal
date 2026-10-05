import { SampleDataNotice } from "@/components/common/sample-data-notice";
import type { PharmacyDetail } from "@/domain/read-models";
import { PharmacyPriceList } from "./pharmacy-price-list";

/** Price list when records exist; otherwise a single honest "not available" line. */
export function PharmacyPricesSection({ detail }: { detail: PharmacyDetail }) {
  if (detail.prices.length > 0) {
    return (
      <div className="space-y-4">
        {detail.hasSampleData && <SampleDataNotice />}
        <PharmacyPriceList prices={detail.prices} hasSampleData={detail.hasSampleData} />
      </div>
    );
  }
  return <p className="text-slate-700">Medicine prices and stock are not available for this pharmacy.</p>;
}
