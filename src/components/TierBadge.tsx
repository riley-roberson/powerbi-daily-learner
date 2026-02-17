import { Tier, tierLabel } from "@/lib/curriculum";

const tierStyles: Record<Tier, string> = {
  foundation: "bg-[#1b365d]/30 text-[#5a8abf] border-[#1b365d]",
  builder: "bg-[#487a7b]/30 text-[#7abcbd] border-[#487a7b]",
  architect: "bg-[#e87722]/30 text-[#f5a060] border-[#e87722]",
};

export default function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${tierStyles[tier]}`}
    >
      {tierLabel(tier)}
    </span>
  );
}
