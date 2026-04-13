import type { ReactNode } from "react";

type Tone = "neutral" | "terracotta" | "amber" | "mint";

const tones: Record<Tone, string> = {
  neutral: "bg-brand-dark/5 text-brand-dark",
  terracotta: "bg-brand-terracotta/10 text-brand-terracotta",
  amber: "bg-brand-amber/10 text-brand-amber",
  mint: "bg-brand-mint/10 text-brand-mint",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
