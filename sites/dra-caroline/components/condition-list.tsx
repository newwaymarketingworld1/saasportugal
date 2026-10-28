import { specialties } from "@/lib/content";
import { cn } from "@/lib/utils";

type Area = (typeof specialties.areas)[number];

export function ConditionList({ area }: { area: Area }) {
  const twoColumns = area.conditions.length > 5;
  return (
    <>
      <p className="t-small font-semibold text-ink">{specialties.conditionsLabel}</p>
      <ul className={cn("mt-4 grid gap-x-8 gap-y-3", twoColumns && "sm:grid-cols-2")}>
        {area.conditions.map((condition) => (
          <li key={condition} className="flex gap-3 text-[1.0625rem] leading-[1.5] text-ink">
            <span aria-hidden="true" className="mt-[0.6em] size-[6px] shrink-0 rounded-full bg-sea" />
            <span>{condition}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
