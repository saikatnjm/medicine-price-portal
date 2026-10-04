export function AboutTheData() {
  return (
    <section aria-labelledby="about-the-data" className="border-t border-slate-200 pt-10">
      <h2 id="about-the-data" className="text-xl font-semibold text-slate-900">
        About this pilot
      </h2>
      <div className="mt-4 grid gap-6 text-slate-700 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold text-slate-900">Consistent information</h3>
          <p className="mt-1">
            Brand, generic, strength and dosage form are presented the same way for every medicine,
            so they are easy to compare. Always check the pack or ask your pharmacist.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">What is sample data</h3>
          <p className="mt-1">
            Pharmacy prices and stock shown during this pilot are sample values and the listed
            pharmacies are fictional. Always confirm prices with the pharmacy.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Not medical advice</h3>
          <p className="mt-1">
            We do not recommend medicines or substitutions. Speak to a doctor or pharmacist before
            starting, stopping or changing a medicine.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Coverage</h3>
          <p className="mt-1">
            The pilot covers a limited set of common medicines in Bangladesh. More medicines and
            real pharmacy data are planned.
          </p>
        </div>
      </div>
    </section>
  );
}
