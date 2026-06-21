import { useMemo, useState } from "react";

type Opt = { id: string; label: string; add: number; per?: "mo" };
type Svc = { id: string; label: string; base: number; per?: "mo"; blurb: string; options: Opt[] };

/** Pricing mirrors the Services section ("From $X"). Estimates are indicative. */
const SERVICES: Svc[] = [
  {
    id: "website",
    label: "Website",
    base: 1800,
    blurb: "Custom, fast, Google-connected.",
    options: [
      { id: "pages", label: "Extra pages (5+)", add: 600 },
      { id: "copy", label: "Copywriting", add: 500 },
      { id: "care", label: "Care plan", add: 120, per: "mo" },
    ],
  },
  {
    id: "social",
    label: "Social",
    base: 650,
    per: "mo",
    blurb: "Planned, shot, scheduled.",
    options: [
      { id: "photo", label: "On-site photography", add: 250, per: "mo" },
      { id: "reels", label: "Reels & video", add: 300, per: "mo" },
    ],
  },
  {
    id: "catalogue",
    label: "Catalogue",
    base: 850,
    blurb: "Print + interactive PDF.",
    options: [
      { id: "print", label: "Managed print run", add: 400 },
      { id: "templates", label: "Reusable templates", add: 300 },
    ],
  },
];

const LABELS: Record<string, string> = { website: "Website", social: "Social", catalogue: "Catalogue" };
const money = (n: number) => "$" + n.toLocaleString("en-AU");
const upper = (n: number) => Math.round((n * 1.3) / 50) * 50;

export default function Estimator() {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [opts, setOpts] = useState<Record<string, boolean>>({});

  const toggleSvc = (id: string) => setPicked((p) => ({ ...p, [id]: !p[id] }));
  const toggleOpt = (key: string) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  const { oneOff, monthly, any } = useMemo(() => {
    let oneOff = 0, monthly = 0, any = false;
    for (const s of SERVICES) {
      if (!picked[s.id]) continue;
      any = true;
      (s.per === "mo" ? (monthly += s.base) : (oneOff += s.base));
      for (const o of s.options) {
        if (!opts[`${s.id}:${o.id}`]) continue;
        o.per === "mo" ? (monthly += o.add) : (oneOff += o.add);
      }
    }
    return { oneOff, monthly, any };
  }, [picked, opts]);

  const startEnquiry = () => {
    const lines: string[] = [];
    for (const s of SERVICES) {
      if (!picked[s.id]) continue;
      const chosen = s.options.filter((o) => opts[`${s.id}:${o.id}`]).map((o) => o.label);
      lines.push(`• ${s.label}${chosen.length ? " — " + chosen.join(", ") : ""}`);
    }
    let est = "";
    if (oneOff) est += `from ${money(oneOff)}–${money(upper(oneOff))} one-off`;
    if (monthly) est += `${est ? " + " : "from "}${money(monthly)}–${money(upper(monthly))}/mo`;
    const msg = `I'd like to enquire about:\n${lines.join("\n")}\n\nIndicative estimate: ${est}.`;

    const form = document.getElementById("contact-form");
    if (form) {
      form.querySelectorAll<HTMLInputElement>('input[name="interest"]').forEach((b) => {
        b.checked = Object.entries(LABELS).some(([id, lab]) => picked[id] && b.value === lab);
      });
      const ta = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (ta) ta.value = msg;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {SERVICES.map((s) => {
          const on = !!picked[s.id];
          return (
            <div
              key={s.id}
              className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${on ? "border-crimson-deep bg-crimson-deep/10 shadow-[0_18px_34px_-18px_rgba(192,42,75,0.5)]" : "border-line bg-graphite hover:border-gold/50 hover:shadow-[0_18px_34px_-20px_rgba(40,22,16,0.5)]"}`}
            >
              <button type="button" aria-pressed={on} onClick={() => toggleSvc(s.id)} className="w-full text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl lg:text-2xl text-cream">{s.label}</span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold ${on ? "bg-crimson-deep border-crimson-deep text-cream" : "border-line text-transparent"}`}
                  >
                    ✓
                  </span>
                </div>
                <p className="text-sm text-cream-mute mt-1">{s.blurb}</p>
                <p className="text-gold text-sm mt-2">
                  from {money(s.base)}
                  {s.per === "mo" ? "/mo" : ""}
                </p>
              </button>
              {on && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.options.map((o) => {
                    const key = `${s.id}:${o.id}`;
                    const oon = !!opts[key];
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={oon}
                        onClick={() => toggleOpt(key)}
                        className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${oon ? "bg-gold/20 border-gold text-cream" : "border-line text-cream-soft hover:border-gold"}`}
                      >
                        {o.label}{" "}
                        <span className="text-cream-mute">
                          +{money(o.add)}
                          {o.per === "mo" ? "/mo" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-graphite p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          {!any && <p className="text-cream-soft lg:text-lg">Select a service to see an estimate.</p>}
          {any && (
            <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
              {oneOff > 0 && (
                <div>
                  <div className="eyebrow mb-1">One-off</div>
                  <div className="font-display text-3xl md:text-4xl gradient-crimson">
                    {money(oneOff)}–{money(upper(oneOff))}
                  </div>
                </div>
              )}
              {monthly > 0 && (
                <div>
                  <div className="eyebrow mb-1">Monthly</div>
                  <div className="font-display text-3xl md:text-4xl gradient-crimson">
                    {money(monthly)}–{money(upper(monthly))}
                    <span className="text-base text-cream-mute font-body">/mo</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="text-xs lg:text-sm text-cream-mute mt-3 max-w-md">
            Indicative only — your final quote comes after a quick chat.
          </p>
        </div>
        <button
          type="button"
          onClick={startEnquiry}
          disabled={!any}
          className="group btn-primary inline-flex items-center justify-center gap-2 bg-crimson-deep hover:bg-crimson text-cream px-7 py-3.5 rounded-full font-semibold tracking-wide shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start this enquiry
          <svg className="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
