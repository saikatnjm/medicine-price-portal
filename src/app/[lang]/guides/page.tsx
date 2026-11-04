import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { ChevronIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface GuidesPageProps {
  params?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: GuidesPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("guide.index.title"),
    description: t("guide.index.description"),
    path: routes.guides(),
    lang,
  });
}

export default async function GuidesPage({ params }: GuidesPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("guide.crumb.home"), href: routes.home() },
    { name: t("guide.crumb.guides") },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.guides(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-4 max-w-3xl space-y-2">
        <h1>{t("guide.index.h1")}</h1>
        <p className="text-slate-700">{t("guide.index.intro")}</p>
        <p className="text-sm text-slate-600">{t("guide.index.count", { n: GUIDES.length })}</p>
      </header>

      <div className="mt-8 space-y-10">
        {GUIDE_CATEGORIES.map((category) => {
          const guides = GUIDES.filter((g) => g.category === category);
          if (guides.length === 0) return null;
          const id = `guides-${category}`;
          return (
            <section key={category} aria-labelledby={id}>
              <SectionHeading id={id} description={t(`guide.category.${category}.desc`)}>
                {t(`guide.category.${category}`)}
              </SectionHeading>
              <ul className="grid gap-3 sm:grid-cols-2">
                {guides.map((guide) => {
                  const content = guide.content[lang];
                  return (
                    <li key={guide.slug} className="relative flex gap-3 rounded-2xl bg-mist p-4 hover:bg-brand-100">
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-base font-semibold text-ink">
                          <Link href={routes.guide(guide.slug)} className="after:absolute after:inset-0 hover:underline">
                            {content.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-700">{content.summary}</p>
                      </div>
                      <ChevronIcon className="mt-1 size-4 text-slate-400" />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
