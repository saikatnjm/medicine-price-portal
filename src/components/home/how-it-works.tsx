const STEPS: { title: string; body: string }[] = [
  {
    title: "Search",
    body: "Type a brand name like Napa or a generic name like Paracetamol.",
  },
  {
    title: "Compare",
    body: "See the generic, strength and form, then compare listed pharmacy prices side by side.",
  },
  {
    title: "Check alternatives",
    body: "See other brands of the same generic, strength and form for information.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works">
      <h2 id="how-it-works" className="text-xl font-semibold text-slate-900">
        How it works
      </h2>
      <ol className="mt-4 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <p className="text-sm font-semibold text-brand-700">Step {index + 1}</p>
            <h3 className="mt-1 font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-slate-700">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
