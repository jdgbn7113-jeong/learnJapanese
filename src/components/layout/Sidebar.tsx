import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../search/SearchBar";
import SettingsModal from "../settings/SettingsModal";

const toneColor = {
  story: "text-story",
  words: "text-words",
  kanji: "text-kanji",
  muted: "text-ink-faint",
};

type Tone = keyof typeof toneColor;

function NavSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-3 px-2 text-[11px] font-bold tracking-wide text-ink-faint">
        {label}
      </div>
      <nav className="mb-6 flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}

function NavItem({
  to,
  jp,
  tone = "muted",
  active,
  onNavigate,
  children,
}: {
  to: string;
  jp: string;
  tone?: Tone;
  active?: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition no-underline",
        active
          ? "bg-brand-soft text-brand"
          : "text-ink-soft hover:bg-line hover:text-ink",
      ].join(" ")}
    >
      <span
        className={`w-[22px] text-center font-jp text-[18px] font-medium ${toneColor[tone]}`}
      >
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

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="text-[24px] font-extrabold leading-tight tracking-[-0.03em] text-brand no-underline"
    >
      RimHahaha
    </Link>
  );
}

function NavGroups({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const isKanji = pathname.startsWith("/jlpt") || pathname.startsWith("/kanji");
  const isVocab = pathname.startsWith("/vocab");
  const isNovel = pathname.startsWith("/novel");

  return (
    <>
      <NavSection label="학습">
        <NavItem
          to="/novel"
          jp="物"
          tone="story"
          active={isNovel}
          onNavigate={onNavigate}
        >
          <span>소설</span>
          <NavMeta>120편</NavMeta>
        </NavItem>
        <NavItem
          to="/vocab/n5"
          jp="語"
          tone="words"
          active={isVocab}
          onNavigate={onNavigate}
        >
          <span>단어</span>
          <NavMeta>2,400+</NavMeta>
        </NavItem>
        <NavItem
          to="/jlpt/n5"
          jp="漢"
          tone="kanji"
          active={isKanji}
          onNavigate={onNavigate}
        >
          <span>한자</span>
          <NavMeta>N5–N1</NavMeta>
        </NavItem>
      </NavSection>

      <NavSection label="사이트">
        <NavItem
          to="/home"
          jp="案"
          tone="muted"
          active={pathname === "/home"}
          onNavigate={onNavigate}
        >
          <span>예전 홈</span>
        </NavItem>
      </NavSection>
    </>
  );
}

function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-line hover:text-ink transition"
      aria-label="설정 열기"
    >
      <span className="w-[22px] text-center font-jp text-[18px] font-medium text-ink-faint">
        ⚙
      </span>
      설정
    </button>
  );
}

export default function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* 모바일 상단 바 */}
      <header className="md:hidden sticky top-0 z-30 bg-surface-card text-ink border-b border-line px-5 py-3.5 flex items-center justify-between">
        <Brand />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
          className="w-9 h-9 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* 모바일 드로어 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-surface-card text-ink border-r border-line px-6 py-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Brand onNavigate={closeMobile} />
              <button
                onClick={closeMobile}
                aria-label="메뉴 닫기"
                className="w-8 h-8 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <SearchBar />
            <NavGroups pathname={pathname} onNavigate={closeMobile} />
            <div className="mt-auto">
              <SettingsButton
                onClick={() => {
                  setSettingsOpen(true);
                  closeMobile();
                }}
              />
            </div>
          </aside>
        </div>
      )}

      {/* 데스크톱 사이드바 — 랜딩 스타일 */}
      <aside className="hidden md:flex sticky top-0 h-screen w-sidebar shrink-0 bg-surface-card border-r border-line px-6 py-8 flex-col">
        <div className="mb-8">
          <Brand />
        </div>

        <div className="mb-6">
          <SearchBar />
        </div>

        <NavGroups pathname={pathname} />

        <div className="mt-auto flex flex-col gap-3.5">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
          <div className="flex justify-between px-1 text-[11px] font-semibold text-ink-faint2">
            <span>© 2026 RimHahaha</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
