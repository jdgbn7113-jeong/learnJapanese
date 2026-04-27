import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../search/SearchBar";
import SettingsModal from "../settings/SettingsModal";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const itemClass =
    "px-3 py-2 rounded-md text-sm text-stone hover:text-accent hover:bg-paper no-underline transition-colors";
  return (
    <nav className="flex flex-col gap-1">
      <Link to="/jlpt/n5" className={itemClass} onClick={onNavigate}>
        한자
      </Link>
      <Link to="/vocab/n5" className={itemClass} onClick={onNavigate}>
        단어
      </Link>
      <Link to="/novel" className={itemClass} onClick={onNavigate}>
        소설
      </Link>
    </nav>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="font-serif text-xl font-bold tracking-tight no-underline text-ink"
    >
      漢字<span className="text-accent">マスター</span>
    </Link>
  );
}

function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-stone hover:text-accent hover:bg-paper transition-colors"
      aria-label="설정 열기"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
      설정
    </button>
  );
}

export default function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* 모바일 상단 바 */}
      <header className="md:hidden sticky top-0 z-30 bg-card text-ink border-b border-border px-4 py-3 flex items-center justify-between">
        <Brand />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
          className="w-9 h-9 flex items-center justify-center rounded-md text-stone hover:text-ink hover:bg-paper transition-colors"
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
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card text-ink border-r border-border p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand onNavigate={closeMobile} />
              <button
                onClick={closeMobile}
                aria-label="메뉴 닫기"
                className="w-8 h-8 flex items-center justify-center rounded-md text-stone hover:text-ink hover:bg-paper transition-colors"
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
            <NavLinks onNavigate={closeMobile} />
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

      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex sticky top-0 h-screen w-56 shrink-0 bg-card text-ink border-r border-border flex-col gap-4 p-5">
        <Brand />
        <SearchBar />
        <NavLinks />
        <div className="mt-auto">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </div>
      </aside>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
