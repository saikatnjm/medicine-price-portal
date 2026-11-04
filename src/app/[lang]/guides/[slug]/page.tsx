import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq } from "@/components/common/faq";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { ChevronIcon, InfoIcon } from "@/components/ui/icons";
import { findGuide, GUIDES, relatedGuides, type Guide, type GuideBlock } from "@/content/guides";
import { services } from "@/data";
import { localizePath, type Locale } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

interface GuidePageProps {
  params: Promise<{ slug: string; lang?: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const guide = findGuide((await params).slug);
  if (!guide) return { title: getT(lang)("guide.notFound.title") };
  const { title, description } = guide.content[lang];
  return pageMetadata({ title, description, path: routes.guide(guide.slug), lang });
}

/** schema.org Article; publisher is the site itself (no invented author). */
function articleJsonLd(guide: Guide, lang: Locale): Record<string, unknown> {
  const { title, description } = guide.content[lang];
  const url = absoluteUrl(localizePath(routes.guide(guide.slug), lang));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: guide.updatedAt,
    inLanguage: lang,
    url,
    mainEntityOfPage: url,
    publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(localizePath(routes.home(), lang)) },
  };
}

const LINK_CARD =
  "relative flex min-h-12 items-center gap-3 rounded-2xl bg-mist px-4 py-3 font-medium text-pine hover:bg-brand-100";

interface SpecialtyLink {
  slug: string;
  name: string;
}

function SpecialtyLinks({ specialties }: { specialties: readonly SpecialtyLink[] }) {
  const t = getT();
  if (specialties.length === 0) return null;
  return (
    <ul aria-label={t("guide.page.specialtiesLabel")} className="flex flex-wrap gap-2">
      {specialties.map(({ slug, name }) => (
        <li key={slug}>
          <Link href={routes.specialty(slug)} className={CHIP_CLASS}>
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Block({ block, specialties }: { block: GuideBlock; specialties: readonly SpecialtyLink[] }) {
  switch (block.type) {
    case "h2":
      return <h2 className="pt-4 text-xl font-semibold text-slate-900">{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc space-y-1 pl-6">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-1 pl-6">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-slate-800">
          <InfoIcon className="mt-0.5 size-5 text-amber-700" />
          <span>{block.text}</span>
        </p>
      );
    case "link":
      return (
        <p>
          <Link href={block.href} className={LINK_CARD}>
            <span className="min-w-0 flex-1">{block.label}</span>
            <ChevronIcon className="size-4 text-slate-400" />
          </Link>
        </p>
      );
    case "specialtyLinks":
      return <SpecialtyLinks specialties={specialties} />;
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const guide = findGuide((await params).slug);
  if (!guide) notFound();

  const content = guide.content[lang];
  const path = routes.guide(guide.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("guide.crumb.home"), href: routes.home() },
    { name: t("guide.crumb.guides"), href: routes.guides() },
    { name: content.title },
  ];
  const related = relatedGuides(guide);
  const newTab = <span className="sr-only"> {t("common.newTab")}</span>;
  const specialties: SpecialtyLink[] = content.body.some((b) => b.type === "specialtyLinks")
    ? (await services.specialties.listSpecialties()).map(({ specialty }) => ({ slug: specialty.slug, name: specialty.name }))
    : [];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[breadcrumbJsonLd(breadcrumbs, path, lang), articleJsonLd(guide, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <article className="mt-4 max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-800">{t(`guide.category.${guide.category}`)}</p>
          <h1>{content.title}</h1>
          <p className="text-lg text-slate-700">{content.summary}</p>
          <p className="text-sm text-slate-600">
            <time dateTime={guide.updatedAt}>{t("guide.page.lastReviewed", { date: formatDate(guide.updatedAt) })}</time>
          </p>
        </header>

        <div className="space-y-4 text-slate-800">
          {content.body.map((block, index) => (
            <Block key={index} block={block} specialties={specialties} />
          ))}
        </div>

        {content.faq && content.faq.length > 0 && (
          <Faq id="guide-faq" items={content.faq.map(({ q, a }) => ({ question: q, answer: a }))} />
        )}

        {guide.category !== "using-the-site" && (
          <p className="border-t border-slate-200 pt-4 text-sm text-slate-600">{t("guide.page.disclaimer")}</p>
        )}

        {guide.sources && guide.sources.length > 0 && (
          <section aria-labelledby="guide-sources">
            <SectionHeading id="guide-sources">{t("guide.page.sources")}</SectionHeading>
            <ul className="list-disc space-y-1 pl-6 text-sm text-slate-700">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words text-brand-800 underline underline-offset-2"
                  >
                    {source.label}
                    {newTab}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="guide-related">
            <SectionHeading id="guide-related">{t("guide.page.related")}</SectionHeading>
            <ul className="space-y-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={routes.guide(g.slug)} className={LINK_CARD}>
                    <span className="min-w-0 flex-1">{g.content[lang].title}</span>
                    <ChevronIcon className="size-4 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p>
          <Link href={routes.guides()} className="font-medium text-brand-800 underline underline-offset-2">
            {t("guide.page.allGuides")}
          </Link>
        </p>
      </article>
    </Container>
  );
}
