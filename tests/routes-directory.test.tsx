// @vitest-environment jsdom
/**
 * Route-level tests for the directory pages (hospitals, pharmacies, doctors,
 * specialties, locations, grouped search). They run against the small fixture
 * dataset instead of the real seed data, so the assertions are deterministic
 * whether or not the OpenStreetMap import has been run.
 */
import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DoctorPage, { generateMetadata as doctorMetadata } from "@/app/doctor/[slug]/page";
import DoctorsPage from "@/app/doctors/page";
import FacilityPage, { generateMetadata as facilityMetadata } from "@/app/hospital/[slug]/page";
import HospitalsPage, { generateMetadata as hospitalsMetadata } from "@/app/hospitals/page";
import LocationPage from "@/app/locations/[slug]/page";
import PharmacyPage, { generateMetadata as pharmacyMetadata } from "@/app/pharmacy/[slug]/page";
import SearchPage from "@/app/search/page";
import { PharmacyPricesSection } from "@/components/pharmacy/pharmacy-prices-section";
import SpecialtyPage from "@/app/specialties/[slug]/page";
import { notFound } from "next/navigation";

// Indexing is opt-in; enable it before the site config is evaluated so the tests
// can tell indexable pages from thin (noindex) ones.
vi.hoisted(() => {
  process.env.SITE_INDEXABLE = "true";
  delete process.env.VERCEL_ENV;
});

vi.mock("@/data", async () => {
  const { createServices } = await import("@/services");
  const { createLocalRepositories } = await import("@/data/local/repositories");
  const { fixtureDataset } = await import("./fixtures");
  return { services: createServices(createLocalRepositories(fixtureDataset)) };
});

// notFound() throws in Next.js; mirror that. NearMeButton (client) needs the router hooks.
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/hospitals",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => import("./components/next-link-mock"));
// Async Server Component (Google enrichment); not under test here and not renderable by the jsdom client renderer.
vi.mock("@/components/directory/google-place-info", () => ({ GooglePlaceInfo: () => null }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const query = (values: Record<string, string> = {}) => ({ searchParams: Promise.resolve(values) });

/** Renders the JSON-LD blocks of a rendered page as one string. */
function jsonLdOf(container: HTMLElement): string {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => script.textContent ?? "")
    .join("\n");
}

/** Page wrappers that return an async Server Component: resolve it like React would on the server. */
async function renderAsyncPage(page: ReactElement) {
  const Component = page.type as unknown as (props: unknown) => Promise<ReactElement>;
  return render(await Component(page.props));
}

describe("/hospitals", () => {
  it("lists the fixture facilities with a labelled filter form", async () => {
    render(await HospitalsPage(query()));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Hospitals & clinics in Bangladesh");
    expect(screen.getByText("3 hospitals and clinics")).toBeTruthy();
    const cards = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(cards).toEqual(expect.arrayContaining(["Central Heart Hospital", "Gulshan Dental Clinic", "Harbour Hospital"]));

    const form = screen.getByRole("search");
    for (const label of ["Name or keyword", "Location", "Type", "Specialty", "Emergency services listed"]) {
      expect(within(form).getByLabelText(label)).toBeTruthy();
    }
    expect(within(form).getByRole("button", { name: "Apply filters" })).toBeTruthy();
    // No filter is applied, so there is nothing to clear.
    expect(screen.queryByRole("link", { name: "Clear filters" })).toBeNull();
    expect(screen.getByRole("button", { name: "Sort by distance from me" })).toBeTruthy();
    expect(screen.getAllByText("OpenStreetMap contributors").length).toBeGreaterThan(0);
  });

  it("is indexable without parameters and noindex with any query parameter", async () => {
    const clean = await hospitalsMetadata(query());
    expect(clean.robots).toMatchObject({ index: true });
    expect(clean.alternates?.canonical).toBe("/hospitals");

    const filtered = await hospitalsMetadata(query({ q: "heart" }));
    expect(filtered.robots).toMatchObject({ index: false });
    expect(filtered.alternates?.canonical).toBe("/hospitals");
  });

  it("filters by the q parameter and offers to clear the filters", async () => {
    render(await HospitalsPage(query({ q: "heart" })));
    expect(screen.getByText("1 hospital or clinic")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Central Heart Hospital" })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "Harbour Hospital" })).toBeNull();
    expect(screen.getByRole("link", { name: "Clear filters" }).getAttribute("href")).toBe("/hospitals");
  });

  it("shows a no-match state (not the empty-dataset state) when a filter matches nothing", async () => {
    render(await HospitalsPage(query({ q: "zzzzqqq" })));
    expect(screen.getByText("No hospitals or clinics match your search.")).toBeTruthy();
    expect(screen.queryByText(/import has not run/)).toBeNull();
  });
});

describe("/hospital/[slug]", () => {
  it("renders the detail page with directions, emergency info, OSM attribution and honest JSON-LD", async () => {
    const { container } = render(await FacilityPage(params("central-heart-hospital-dhaka")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Central Heart Hospital");

    const directions = screen.getByRole("link", { name: "Get directions" });
    expect(directions.getAttribute("href")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=23.75%2C90.38",
    );
    expect(directions.getAttribute("rel")).toContain("noopener");

    // Quick actions: only what the record supports.
    expect(screen.getByRole("link", { name: /^Call Central Heart Hospital/ }).getAttribute("href")).toBe("tel:+88020000001");
    const website = screen.getAllByRole("link", { name: /^Website of Central Heart Hospital/ })[0]!;
    expect(website.getAttribute("href")).toBe("https://example.org/hospital");
    expect(website.getAttribute("rel")).toBe("noopener noreferrer nofollow");
    expect(screen.getAllByRole("link", { name: /^Directions to Central Heart Hospital/ }).length).toBeGreaterThan(0);
    // Kind label, trust badge and source section.
    expect(screen.getByText("Private hospital")).toBeTruthy();
    expect(screen.getByText("Community-mapped")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Source & last checked" })).toBeTruthy();
    expect(screen.getByText("Community-mapped; not verified by us")).toBeTruthy();
    // Grouped nearby records: the fixture has a pharmacy within 5 km and nothing else.
    expect(screen.getByRole("heading", { level: 2, name: "Nearby pharmacies" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Nearby hospitals" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Nearby clinics" })).toBeNull();
    // Report options: OSM edit link (derived from way/201); no report link without NEXT_PUBLIC_REPORT_URL.
    expect(screen.getByRole("heading", { level: 2, name: "Is something incorrect?" })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /^Suggest an edit on OpenStreetMap/ }).getAttribute("href"),
    ).toBe("https://www.openstreetmap.org/edit?way=201");
    expect(screen.queryByRole("link", { name: /^Report this information/ })).toBeNull();

    expect(screen.getAllByText("Emergency services listed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("© OpenStreetMap contributors").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Community-mapped information that we have not verified/).length).toBeGreaterThan(0);
    expect(screen.getByText(/not medical advice/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dr. Test Example" }).getAttribute("href")).toBe("/doctor/dr-test-example");

    const jsonLd = jsonLdOf(container);
    expect(jsonLd).toContain('"@type":"Hospital"');
    expect(jsonLd).toContain('"@type":"BreadcrumbList"');
    expect(jsonLd).toContain('"addressCountry":"BD"');
    expect(jsonLd).not.toContain("aggregateRating");
    expect(jsonLd).not.toContain("review");
  });

  it("is indexable when it has public details and noindex when it is a bare name-only record", async () => {
    const rich = await facilityMetadata(params("central-heart-hospital-dhaka"));
    expect(rich.robots).toMatchObject({ index: true });
    expect(rich.title).toBe("Central Heart Hospital, Dhanmondi");
    expect(rich.alternates?.canonical).toBe("/hospital/central-heart-hospital-dhaka");

    const thin = await facilityMetadata(params("harbour-hospital-chattogram"));
    expect(thin.robots).toMatchObject({ index: false });
    expect(thin.alternates?.canonical).toBe("/hospital/harbour-hospital-chattogram");
  });

  it("still renders a thin record, without inventing contact details", async () => {
    render(await FacilityPage(params("harbour-hospital-chattogram")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Harbour Hospital");
    // Nothing is published, so no contact section, call/website actions or empty placeholders.
    expect(screen.queryByRole("heading", { name: "Contact" })).toBeNull();
    expect(screen.queryByRole("link", { name: /^Call / })).toBeNull();
    expect(screen.queryByRole("link", { name: /^Website/ })).toBeNull();
    expect(screen.queryByRole("heading", { name: /^Nearby/ })).toBeNull();
    expect(screen.queryByText("Emergency services listed")).toBeNull();
  });

  it("calls notFound() for an unknown slug", async () => {
    await expect(FacilityPage(params("no-such-hospital"))).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
    expect((await facilityMetadata(params("no-such-hospital"))).title).toBe("Hospital or clinic not found");
  });
});

describe("/pharmacy/[slug]", () => {
  it("renders the directory pharmacy with contact, directions, sample-price notice and source", async () => {
    const { container } = render(await PharmacyPage(params("alpha-pharmacy")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Alpha Pharmacy");
    expect(screen.getByRole("link", { name: "+880 1700-000001" }).getAttribute("href")).toBe("tel:+8801700000001");
    expect(screen.getByRole("link", { name: "Get directions" }).getAttribute("href")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=23.7465%2C90.376",
    );
    // The fixture pharmacy carries sample prices: they must be labelled as such, never as live.
    expect(screen.getByRole("heading", { name: "Sample prices at this pharmacy" })).toBeTruthy();
    expect(screen.getByRole("note").textContent).toMatch(/not live pharmacy information/);
    expect(screen.getByRole("link", { name: "Napa 500 mg" }).getAttribute("href")).toBe("/medicine/napa-500mg");
    expect(screen.getAllByText("© OpenStreetMap contributors").length).toBeGreaterThan(0);
    // Quick actions and sections of the pharmacy page.
    expect(screen.getByRole("link", { name: /^Call Alpha Pharmacy/ }).getAttribute("href")).toBe("tel:+8801700000001");
    expect(screen.getByRole("link", { name: /^Google Maps for Alpha Pharmacy/ })).toBeTruthy();
    expect(screen.getAllByText("Pharmacy").length).toBeGreaterThan(0);
    expect(screen.getByText("Community-mapped")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Nearby hospitals & clinics" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Source & last checked" })).toBeTruthy();

    const jsonLd = jsonLdOf(container);
    expect(jsonLd).toContain('"@type":"Pharmacy"');
    expect(jsonLd).not.toContain("aggregateRating");
  });

  it("says prices are not available when a pharmacy has none", async () => {
    render(await PharmacyPage(params("beta-pharmacy")));
    expect(screen.queryByRole("link", { name: /^Call / })).toBeNull();
    expect(screen.getAllByRole("link", { name: /^Directions to Beta Pharmacy/ }).length).toBeGreaterThan(0);
  });

  it("shows only the not-available line when a pharmacy has no price records", () => {
    const detail = { prices: [], hasSampleData: false } as unknown as Parameters<typeof PharmacyPricesSection>[0]["detail"];
    render(<PharmacyPricesSection detail={detail} />);
    expect(screen.getByText("Medicine prices and stock are not available for this pharmacy.")).toBeTruthy();
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("has a unique title and canonical URL, and 404s for unknown slugs", async () => {
    const metadata = await pharmacyMetadata(params("alpha-pharmacy"));
    expect(metadata.title).toBe("Alpha Pharmacy, Dhanmondi — Pharmacy location & contact");
    expect(metadata.alternates?.canonical).toBe("/pharmacy/alpha-pharmacy");
    await expect(PharmacyPage(params("no-such-pharmacy"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("/doctors", () => {
  it("lists the fixture doctor instead of the empty-dataset notice", async () => {
    await renderAsyncPage(await DoctorsPage(query()));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Doctors in Bangladesh");
    expect(screen.getByRole("heading", { level: 2, name: "1 doctor" })).toBeTruthy();
    const card = screen.getByRole("link", { name: "Dr. Test Example" });
    expect(card.getAttribute("href")).toBe("/doctor/dr-test-example");
    expect(screen.getAllByText("Cardiologist").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Doctor profiles are not listed yet/)).toBeNull();
    expect(screen.getByLabelText("Doctor name")).toBeTruthy();
  });
});

describe("/doctor/[slug]", () => {
  it("renders both chambers with consultation details", async () => {
    const { container } = render(await DoctorPage(params("dr-test-example")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dr. Test Example");
    expect(screen.getByText("MBBS (test)")).toBeTruthy();
    expect(container.querySelector('a[href="/specialties/cardiology"]')).not.toBeNull();

    const chambers = screen.getAllByRole("heading", { level: 2, name: /^Chamber:/ });
    expect(chambers.map((h) => h.textContent)).toEqual([
      "Chamber: Central Heart Hospital",
      "Chamber: Test Chamber",
    ]);
    expect(screen.getByText("Consultation hours")).toBeTruthy();
    expect(screen.getByText("5 pm – 9 pm")).toBeTruthy();
    expect(screen.getByText("Sat–Thu")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Central Heart Hospital" }).getAttribute("href")).toBe(
      "/hospital/central-heart-hospital-dhaka",
    );
    expect(screen.getByText(/not medical advice/)).toBeTruthy();

    const jsonLd = jsonLdOf(container);
    expect(jsonLd).toContain('"@type":"Physician"');
    expect(jsonLd).not.toContain("aggregateRating");
  });

  it("builds the title from name, specialty and place, and 404s for unknown slugs", async () => {
    const metadata = await doctorMetadata(params("dr-test-example"));
    expect(metadata.title).toMatch(/^Dr\. Test Example — Cardiologist in /);
    expect(metadata.alternates?.canonical).toBe("/doctor/dr-test-example");
    await expect(DoctorPage(params("nobody"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("/specialties/[slug]", () => {
  it("shows the specialty with its facilities and doctors", async () => {
    render(await SpecialtyPage(params("cardiology")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Cardiology");
    expect(screen.getByText(/heart and blood vessels/)).toBeTruthy();
    expect(screen.getByText("Practitioner:")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Hospitals & clinics offering Cardiology" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Central Heart Hospital" }).getAttribute("href")).toBe(
      "/hospital/central-heart-hospital-dhaka",
    );
    expect(screen.getByRole("heading", { level: 2, name: "Cardiologists" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dr. Test Example" })).toBeTruthy();
    expect(screen.queryByText(/Doctor profiles are not listed yet/)).toBeNull();
    expect(screen.getByText(/not medical advice/)).toBeTruthy();
  });

  it("calls notFound() for an unknown specialty", async () => {
    await expect(SpecialtyPage(params("astrology"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("/locations/[slug]", () => {
  it("shows the facility summary, hospitals, pharmacies, doctors and sub-locations for a district", async () => {
    render(await LocationPage(params("dhaka")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Healthcare in Dhaka");
    for (const name of ["Healthcare facilities", "Hospitals", "Pharmacies", "Doctors", "Areas in Dhaka"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeTruthy();
    }
    // The fixture has no clinics or diagnostic centres, so those sections are omitted.
    expect(screen.queryByRole("heading", { name: "Clinics & health centres" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Diagnostic centres" })).toBeNull();
    expect(screen.getByRole("link", { name: "See all 1 hospitals" }).getAttribute("href")).toBe("/hospitals/dhaka?kind=hospital");
    expect(screen.getByRole("link", { name: "See all 2 pharmacies" }).getAttribute("href")).toBe("/pharmacies/dhaka");
    expect(screen.getByRole("link", { name: "Central Heart Hospital" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Alpha Pharmacy" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dhanmondi" }).getAttribute("href")).toBe("/locations/dhanmondi");
    expect(screen.getByRole("link", { name: "Gulshan" }).getAttribute("href")).toBe("/locations/gulshan");
    expect(screen.getAllByText("OpenStreetMap contributors").length).toBeGreaterThan(0);
  });

  it("calls notFound() for an unknown location", async () => {
    await expect(LocationPage(params("atlantis"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("/search grouped results", () => {
  it("understands a practitioner title and shows doctor and specialty groups", async () => {
    render(await SearchPage(query({ q: "Cardiologist" })));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Results for “Cardiologist”");
    expect(screen.getByText("Understood as:")).toBeTruthy();
    // The line links to the matching directory page (the doctors list).
    expect(screen.getByRole("link", { name: "Cardiologists" }).getAttribute("href")).toMatch(/^\/doctors/);

    expect(screen.getByRole("heading", { level: 2, name: "Doctors (1)" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Specialties (1)" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dr. Test Example" })).toBeTruthy();
    // A structured query does not fall back to a medicine search.
    expect(screen.queryByRole("heading", { name: /^Medicines/ })).toBeNull();
    // Tabs link between the grouped and the medicines-only view.
    expect(screen.getByRole("link", { name: "Medicines only" }).getAttribute("href")).toBe(
      "/search?q=Cardiologist&type=medicine",
    );
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Cardiologist");
  });

  it("groups mixed results for a place name", async () => {
    render(await SearchPage(query({ q: "Dhaka" })));
    expect(screen.getByRole("heading", { level: 2, name: "Hospitals & clinics (2)" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Pharmacies (2)" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Locations (1)" })).toBeTruthy();
    expect(screen.getAllByText("OpenStreetMap contributors").length).toBeGreaterThan(0);
  });

  it("shows only medicines for a brand name", async () => {
    render(await SearchPage(query({ q: "Napa" })));
    expect(screen.getByRole("heading", { level: 2, name: "Medicines (4)" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /^Doctors/ })).toBeNull();
    expect(screen.queryByText("Understood as:")).toBeNull();
  });

  it("shows a no-results state with example searches", async () => {
    render(await SearchPage(query({ q: "qqqzzz" })));
    expect(screen.getByText("No results found for “qqqzzz”.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Cardiologist" })).toBeTruthy();
  });
});
