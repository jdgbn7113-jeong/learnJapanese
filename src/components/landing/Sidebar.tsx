import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Sidebar — fixed-left navigation. 260px wide on desktop, collapses to top bar < 860px.
 */
export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-sidebar flex flex-col border-r border-line bg-surface-card px-6 py-8 max-[860px]:relative max-[860px]:w-full max-[860px]:flex-row max-[860px]:items-center max-[860px]:justify-between max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:py-3.5 max-[860px]:px-5">
      <div className="mb-11 max-[860px]:mb-0">
        <Link to="/" className="text-[24px] font-extrabold leading-tight tracking-[-0.03em] text-brand no-underline">
          RimHahaha
        </Link>
      </div>

      <NavSection label="학습" className="max-[860px]:hidden">
        <NavItem to="/novel" jp="物" tone="story" active>
          <span>소설</span>
          <NavMeta>120편</NavMeta>
        </NavItem>
        <NavItem to="/vocab/n5" jp="語" tone="words">
          <span>단어</span>
          <NavMeta>2,400+</NavMeta>
        </NavItem>
        <NavItem to="/jlpt/n5" jp="漢" tone="kanji">
          <span>한자</span>
          <NavMeta>N5–N1</NavMeta>
        </NavItem>
      </NavSection>

      <NavSection label="사이트" className="max-[860px]:hidden">
        <NavItem to="/home" jp="案" tone="muted">
          <span>예전 홈</span>
        </NavItem>
      </NavSection>

      <div className="mt-auto flex flex-col gap-3.5 max-[860px]:hidden">
        <div className="flex justify-between px-1 text-[11px] font-semibold text-ink-faint2">
          <span>© 2026 RimHahaha</span>
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
}

function NavSection({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-3 px-2 text-[11px] font-bold tracking-wide text-ink-faint">
        {label}
      </div>
      <nav className="mb-6 flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}

const toneColor = {
  story: "text-story",
  words: "text-words",
  kanji: "text-kanji",
  muted: "text-ink-faint",
};

type Tone = keyof typeof toneColor;

function NavItem({ to, jp, tone = "muted", active, children }: { to: string; jp: string; tone?: Tone; active?: boolean; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={[
        "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition no-underline",
        active
          ? "bg-brand-soft text-brand"
          : "text-ink-soft hover:bg-line hover:text-ink",
      ].join(" ")}
    >
      <span className={`w-[22px] text-center font-jp text-[18px] font-medium ${toneColor[tone]}`}>
        {jp}
      </span>
      {children}
    </Link>
  );
}

function NavMeta({ children }: { children: ReactNode }) {
  return (
    <span className="ml-auto text-[11px] font-semibold tracking-wide text-ink-faint2">
      {children}
    </span>
  );
}
