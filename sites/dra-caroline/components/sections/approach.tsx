import { approach } from "@/lib/content";

export function Approach() {
  return (
    <section id="abordagem" aria-labelledby="abordagem-title" className="section-y bg-paper">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <h2 id="abordagem-title" className="t-h2 text-ink lg:col-span-9">
            {approach.title}
          </h2>
          <p className="t-lead mt-6 text-ink lg:col-span-7 lg:mt-8">{approach.lead}</p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:mt-20 lg:gap-y-14">
          {approach.items.map((item) => (
            <li key={item.title} className="border-t border-line pt-6">
              <h3 className="t-h3 text-ink">{item.title}</h3>
              <p className="t-body mt-3 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
