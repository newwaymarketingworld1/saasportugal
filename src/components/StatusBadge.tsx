import type { BriefingStatus } from "@/lib/constants";

const STYLES: Record<BriefingStatus, string> = {
  novo: "bg-brand text-ink",
  "em análise": "bg-ink text-white",
  concluído: "border border-ink bg-paper text-ink",
};

export function StatusBadge({ status }: { status: BriefingStatus }) {
  return (
    <span
      className={`inline-block whitespace-nowrap px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${STYLES[status] ?? "bg-line text-ink"}`}
    >
      {status}
    </span>
  );
}
