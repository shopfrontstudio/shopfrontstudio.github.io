import { useState } from "react";

/**
 * Example React island — a template to show how React fits into this Astro site.
 *
 * Usage in any .astro file:
 *   ---
 *   import Example from "../components/react/Example.tsx";
 *   ---
 *   <Example client:visible />   // hydrates when scrolled into view
 *
 * Client directives:
 *   client:load    — hydrate immediately
 *   client:idle    — hydrate when the browser is idle
 *   client:visible — hydrate when it enters the viewport (best for perf)
 *
 * Without a client:* directive the component renders to static HTML and ships
 * zero JS — so React only adds weight where you actually need interactivity.
 */
export default function Example() {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      className="inline-flex items-center gap-2 rounded-full bg-crimson-deep px-5 py-2 text-cream"
    >
      Clicked {count} {count === 1 ? "time" : "times"}
    </button>
  );
}
