import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import WordPracticeCanvas from "../components/canvas/WordPracticeCanvas";

const PRACTICE_MODE_KEY = "vocab:practiceMode";
import { useVocabData } from "../hooks/useVocabData";
import { useKanjiData } from "../hooks/useKanjiData";
import type { VocabLevel } from "../types/vocab";

function isKanjiChar(ch: string): boolean {
  return /[\u4e00-\u9fff]/.test(ch);
}

function NavArrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export default function VocabDetailPage() {
  const { level, index } = useParams<{ level: string; index: string }>();
  const currentLevel = (level?.toUpperCase() ?? "N5") as VocabLevel;
  const idx = Number(index);
  const { words, loading, error } = useVocabData(currentLevel);
  const { getKanji } = useKanjiData();

  const [showHints, setShowHints] = useState<boolean>(() => {
    const stored = localStorage.getItem(PRACTICE_MODE_KEY);
    return stored === null ? true : stored === "practice";
  });

  const setMode = (mode: "practice" | "real") => {
    localStorage.setItem(PRACTICE_MODE_KEY, mode);
    setShowHints(mode === "practice");
  };

  const word = Number.isFinite(idx) ? words[idx] : undefined;
  const prevIdx = idx > 0 ? idx - 1 : null;
  const nextIdx = idx < words.length - 1 ? idx + 1 : null;

  const displayChars = useMemo(() => {
    if (!word) return [] as string[];
    const source = word.kanji ?? word.kana;
    return Array.from(source);
  }, [word]);

  const kanaChars = useMemo(() => {
    if (!word || !word.kanji) return [] as string[];
    return Array.from(word.kana);
  }, [word]);

  const kanjiInWord = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const c of displayChars) {
      if (isKanjiChar(c) && !seen.has(c)) {
        seen.add(c);
        result.push(c);
      }
    }
    return result;
  }, [displayChars]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center text-stone-light">로딩 중...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-20 text-center text-stone-light">{error}</div>
      </Layout>
    );
  }

  if (!word) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="text-stone text-lg mb-4">단어를 찾을 수 없습니다.</p>
          <Link to={`/vocab/${currentLevel.toLowerCase()}`} className="text-accent hover:underline">
            단어 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  const prev = prevIdx !== null ? words[prevIdx] : undefined;
  const next = nextIdx !== null ? words[nextIdx] : undefined;
  const levelLower = currentLevel.toLowerCase();

  return (
    <Layout>
      <div className="flex gap-3 md:gap-5">
        {/* 왼쪽 이동 버튼 */}
        <div className="hidden md:block shrink-0 w-14">
          {prev && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/vocab/${levelLower}/${prevIdx}`}
                aria-label={`이전 단어: ${prev.kanji ?? prev.kana}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <NavArrow dir="prev" />
                  <span className="font-serif text-sm font-bold max-w-[3rem] truncate">
                    {prev.kanji ?? prev.kana}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 py-4">
          {/* 모바일용 상하단 이전/다음 */}
          <div className="flex md:hidden justify-between gap-2 mb-4">
            {prev ? (
              <Link
                to={`/vocab/${levelLower}/${prevIdx}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
              >
                <NavArrow dir="prev" />
                <span className="font-serif font-bold truncate">
                  {prev.kanji ?? prev.kana}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                to={`/vocab/${levelLower}/${nextIdx}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
              >
                <span className="font-serif font-bold truncate">
                  {next.kanji ?? next.kana}
                </span>
                <NavArrow dir="next" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          {/* 단어 헤더 */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="text-center md:text-left shrink-0">
              <span className="font-serif text-[96px] leading-none font-bold text-ink block break-keep">
                {word.kanji ?? word.kana}
              </span>
              {word.kanji && (
                <span className="block mt-2 text-stone text-lg">
                  {word.kana}
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-2xl font-bold mb-3">{word.meaning}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent">
                  JLPT {currentLevel}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-ink/5 text-stone">
                  {word.pos}
                </span>
              </div>
              <Link
                to={`/vocab/${levelLower}`}
                className="text-sm text-stone hover:text-accent no-underline w-fit"
              >
                ← 단어 목록으로
              </Link>
            </div>
          </div>

          {/* 한자 배우기 — 이 단어에 포함된 한자 버튼 */}
          {kanjiInWord.length > 0 && (
            <div className="mb-8 bg-accent/5 border border-accent/30 rounded-xl p-5">
              <h2 className="text-sm font-bold tracking-wider uppercase text-accent mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                한자 배우기
              </h2>
              <div className="flex flex-wrap gap-3">
                {kanjiInWord.map((ch) => {
                  const k = getKanji(ch);
                  return (
                    <Link
                      key={ch}
                      to={`/kanji/${ch}`}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-accent/40 bg-card no-underline hover:bg-accent hover:border-accent transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="font-serif text-4xl font-bold text-ink leading-none group-hover:text-white transition-colors">
                        {ch}
                      </span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-stone group-hover:text-white/90 transition-colors">
                          {k ? k.meanings.slice(0, 2).join(", ") : "미등록"}
                        </span>
                        <span className="text-xs text-stone-light group-hover:text-white/70 transition-colors mt-0.5">
                          자세히 보기 →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 쓰기 연습 */}
          <div className="bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h2 className="text-sm font-bold tracking-wider uppercase text-stone-light">
                쓰기 연습
              </h2>
              <div
                role="group"
                aria-label="힌트 표시"
                className="inline-flex gap-1 p-1 rounded-full bg-stone-light/10 text-xs font-semibold"
              >
                <button
                  type="button"
                  onClick={() => setMode("practice")}
                  aria-pressed={showHints}
                  className={`px-3 py-1 rounded-full transition-all duration-150 active:scale-95 ${
                    showHints
                      ? "bg-paper text-ink shadow-sm"
                      : "bg-transparent text-stone hover:text-ink"
                  }`}
                >
                  연습
                </button>
                <button
                  type="button"
                  onClick={() => setMode("real")}
                  aria-pressed={!showHints}
                  className={`px-3 py-1 rounded-full transition-all duration-150 active:scale-95 ${
                    !showHints
                      ? "bg-paper text-ink shadow-sm"
                      : "bg-transparent text-stone hover:text-ink"
                  }`}
                >
                  실전
                </button>
              </div>
            </div>
            <div className="space-y-5">
              {kanaChars.length > 0 && (
                <WordPracticeCanvas
                  chars={kanaChars}
                  label="읽기 (가나)"
                  meaning={word.meaning}
                  cellsPerRow={4}
                  showHints={showHints}
                />
              )}
              <WordPracticeCanvas
                chars={displayChars}
                label={kanaChars.length > 0 ? "표기" : undefined}
                meaning={word.meaning}
                cellsPerRow={word.kanji ? 3 : 4}
                showHints={showHints}
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 이동 버튼 */}
        <div className="hidden md:block shrink-0 w-14">
          {next && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/vocab/${levelLower}/${nextIdx}`}
                aria-label={`다음 단어: ${next.kanji ?? next.kana}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <NavArrow dir="next" />
                  <span className="font-serif text-sm font-bold max-w-[3rem] truncate">
                    {next.kanji ?? next.kana}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
