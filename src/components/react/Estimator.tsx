import { useEffect, useMemo, useRef, useState } from "react";

/** Tween a number toward its target so the estimate animates up/down. */
function useTween(target: number, dur = 700) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target; setVal(target); return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (target - a) * eased;
      setVal(v); from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
      else { from.current = target; setVal(target); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

type Item = { id: string; label: string; price: number; per?: "mo"; note: string };

// Market-aligned, boutique "from" pricing — quoted in writing after scope.
const BUILDS: Item[] = [
  { id: "landing", label: "Landing / Starter", price: 1800, note: "A sharp one-page launch or campaign site." },
  { id: "business", label: "Business Website", price: 4800, note: "Polished 4–7 pages, SEO basics, enquiry flow." },
  { id: "signature", label: "Signature Cinematic", price: 8500, note: "Custom motion, mockups, high-end brand feel." },
  { id: "ecommerce", label: "eCommerce / Booking", price: 9500, note: "Store, bookings or payments built in." },
];
const MONTHLY: Item[] = [
  { id: "care", label: "Website Care", price: 250, per: "mo", note: "Updates, backups, checks, light support." },
  { id: "social", label: "Social Presence", price: 1200, per: "mo", note: "Content direction, design, scheduling." },
  { id: "local", label: "Local Visibility", price: 850, per: "mo", note: "Google Business & local search growth." },
];
const ADDONS: Item[] = [
  { id: "gbp", label: "Google Business setup", price: 450, note: "" },
  { id: "catalogue", label: "Digital catalogue / lookbook", price: 850, note: "" },
  { id: "brand", label: "Brand refresh mini-kit", price: 950, note: "" },
  { id: "landadd", label: "Landing page add-on", price: 1200, note: "" },
];

const money = (n: number) => "$" + n.toLocaleString("en-AU");

export default function Estimator() {
  const [build, setBuild] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<Record<string, boolean>>({});
  const [addons, setAddons] = useState<Record<string, boolean>>({});

  const toggle = (set: typeof setMonthly) => (id: string) => set((m) => ({ ...m, [id]: !m[id] }));

  const { oneOff, perMonth, any } = useMemo(() => {
    let oneOff = 0, perMonth = 0;
    const b = BUILDS.find((x) => x.id === build);
    if (b) oneOff += b.price;
    ADDONS.forEach((a) => { if (addons[a.id]) oneOff += a.price; });
    MONTHLY.forEach((m) => { if (monthly[m.id]) perMonth += m.price; });
    return { oneOff, perMonth, any: !!b || oneOff > 0 || perMonth > 0 };
  }, [build, monthly, addons]);

  const aOne = useTween(oneOff);
  const aMon = useTween(perMonth);

  const requestQuote = () => {
    const lines: string[] = [];
    const b = BUILDS.find((x) => x.id === build);
    if (b) lines.push(`• Build: ${b.label} (from ${money(b.price)})`);
    MONTHLY.forEach((m) => { if (monthly[m.id]) lines.push(`• ${m.label} (from ${money(m.price)}/mo)`); });
    ADDONS.forEach((a) => { if (addons[a.id]) lines.push(`• ${a.label} (from ${money(a.price)})`); });
    let est = "";
    if (oneOff) est += `from ${money(oneOff)} one-off`;
    if (perMonth) est += `${est ? " + " : "from "}${money(perMonth)}/mo`;
    const msg = `I'd like a written quote for:\n${lines.join("\n")}\n\nIndicative: ${est}.`;

    const form = document.getElementById("contact-form");
    if (form) {
      const wantWeb = !!build || addons.landadd;
      const wantSocial = !!monthly.social;
      const wantCat = !!addons.catalogue;
      form.querySelectorAll<HTMLInputElement>('input[name="interest"]').forEach((el) => {
        el.checked =
          (el.value === "Website" && wantWeb) ||
          (el.value === "Social" && wantSocial) ||
          (el.value === "Catalogue" && wantCat);
      });
      const ta = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (ta) ta.value = msg;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Build (single choice) */}
      <div className="text-[11px] lg:text-[14px] uppercase tracking-[0.28em] text-gold mb-4">Choose a build</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BUILDS.map((b) => {
          const on = build === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={on}
              onClick={() => setBuild(on ? null : b.id)}
              className={`text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${on ? "border-crimson-deep bg-crimson-deep/10 shadow-[0_18px_34px_-18px_rgba(192,42,75,0.5)]" : "border-line bg-graphite hover:border-gold/50 hover:shadow-[0_18px_34px_-20px_rgba(40,22,16,0.5)]"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg lg:text-xl text-cream">{b.label}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${on ? "bg-crimson-deep border-crimson-deep text-cream" : "border-line text-transparent"}`}>✓</span>
              </div>
              <p className="text-[13px] text-cream-mute mt-1.5 leading-snug">{b.note}</p>
              <p className="text-gold text-sm mt-3">from {money(b.price)}</p>
            </button>
          );
        })}
      </div>

      {/* Monthly (multi) */}
      <div className="text-[11px] lg:text-[14px] uppercase tracking-[0.28em] text-gold mb-4 mt-10">Add monthly support</div>
      <div className="grid sm:grid-cols-3 gap-4">
        {MONTHLY.map((m) => {
          const on = !!monthly[m.id];
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(setMonthly)(m.id)}
              className={`text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${on ? "border-gold bg-gold/10 shadow-[0_18px_34px_-20px_rgba(200,161,90,0.5)]" : "border-line bg-graphite hover:border-gold/50"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-cream">{m.label}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${on ? "bg-gold border-gold text-night" : "border-line text-transparent"}`}>✓</span>
              </div>
              <p className="text-[13px] text-cream-mute mt-1.5 leading-snug">{m.note}</p>
              <p className="text-gold text-sm mt-3">from {money(m.price)}/mo</p>
            </button>
          );
        })}
      </div>

      {/* Add-ons (multi chips) */}
      <div className="text-[11px] lg:text-[14px] uppercase tracking-[0.28em] text-gold mb-4 mt-10">One-off add-ons</div>
      <div className="flex flex-wrap gap-2.5">
        {ADDONS.map((a) => {
          const on = !!addons[a.id];
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(setAddons)(a.id)}
              className={`text-sm rounded-full px-4 py-2 border transition-colors ${on ? "bg-crimson-deep border-crimson-deep text-cream" : "border-line text-cream-soft hover:border-gold"}`}
            >
              {a.label} <span className={on ? "text-cream/70" : "text-cream-mute"}>from {money(a.price)}</span>
            </button>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-10 rounded-2xl border border-line bg-graphite p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 glow-hover">
        <div>
          {!any && <p className="text-cream-soft lg:text-lg">Pick a build to see an estimate.</p>}
          {any && (
            <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
              {oneOff > 0 && (
                <div>
                  <div className="eyebrow mb-1">One-off, from</div>
                  <div className="font-display text-3xl md:text-5xl gradient-crimson tabular-nums">{money(Math.round(aOne))}</div>
                </div>
              )}
              {perMonth > 0 && (
                <div>
                  <div className="eyebrow mb-1">Monthly, from</div>
                  <div className="font-display text-3xl md:text-5xl gradient-crimson tabular-nums">
                    {money(Math.round(aMon))}<span className="text-base text-cream-mute font-body">/mo</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="text-xs lg:text-sm text-cream-mute mt-3 max-w-md">
            Indicative only. Every quote is written and fixed before any work begins.
          </p>
        </div>
        <button
          type="button"
          onClick={requestQuote}
          disabled={!any}
          className="group btn-primary inline-flex items-center justify-center gap-2 bg-crimson-deep hover:bg-crimson text-cream px-7 py-3.5 rounded-full font-semibold tracking-wide shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Request written quote
          <svg className="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
