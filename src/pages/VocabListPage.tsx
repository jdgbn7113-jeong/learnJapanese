import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { useVocabData } from "../hooks/useVocabData";
import type { PartOfSpeech, VocabLevel, VocabWord } from "../types/vocab";

const LEVELS: VocabLevel[] = ["N5", "N4", "N3", "N2", "N1"];

const POS_ORDER: PartOfSpeech[] = [
  "명사",
  "동사",
  "い형용사",
  "な형용사",
  "부사",
  "대명사",
  "의문사",
  "연체사",
  "수사",
  "조사",
  "접속사",
  "감탄사",
  "인사",
];

const POS_COLORS: Record<PartOfSpeech, string> = {
  명사: "bg-[#eef2fb] text-[#3a4a6b]",
  동사: "bg-[#fdecec] text-[#a33]",
  い형용사: "bg-[#f0ebfb] text-[#5b3a9b]",
  な형용사: "bg-[#ebf6f0] text-[#2f6b4a]",
  부사: "bg-[#fbf3e3] text-[#8a6a1a]",
  대명사: "bg-[#eef6fb] text-[#2f5a7a]",
  의문사: "bg-[#fbebf3] text-[#8a2f5a]",
  연체사: "bg-[#f3f3f3] text-[#555]",
  수사: "bg-[#e8f5f3] text-[#2a6b66]",
  조사: "bg-[#f5f0e3] text-[#6b5a2a]",
  접속사: "bg-[#eceff3] text-[#455a6b]",
  감탄사: "bg-[#fbf0eb] text-[#8a5a3a]",
  인사: "bg-[#f0fbf3] text-[#2a6b3a]",
};

function KanjiInline({ kanji }: { kanji: string }) {
  return <span>{kanji}</span>;
}

function VocabRow({
  word,
  onOpen,
}: {
  word: VocabWord;
  onOpen: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex items-baseline gap-4 px-4 py-3 border-b border-border last:border-b-0 hover:bg-paper cursor-pointer transition-colors focus:outline-none focus:bg-paper"
    >
      <div className="flex-shrink-0 min-w-[7rem]">
        {word.kanji ? (
          <div className="font-serif text-lg font-bold leading-tight">
            <KanjiInline kanji={word.kanji} />
          </div>
        ) : (
          <div className="font-serif text-lg font-bold leading-tight">
            {word.kana}
          </div>
        )}
        <div className="text-xs text-stone-light mt-0.5">
          {word.kanji ? word.kana : "\u00A0"}
        </div>
      </div>
      <div className="flex-1 text-sm text-ink leading-relaxed">
        {word.meaning}
      </div>
      <div
        className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded ${POS_COLORS[word.pos]}`}
      >
        {word.pos}
      </div>
    </div>
  );
}

export default function VocabListPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const currentLevel = (level?.toUpperCase() ?? "N5") as VocabLevel;
  const { words, loading, error } = useVocabData(currentLevel);
  const [posFilter, setPosFilter] = useState<PartOfSpeech | "전체">("전체");

  const posCounts = useMemo(() => {
    const c: Partial<Record<PartOfSpeech, number>> = {};
    for (const w of words) c[w.pos] = (c[w.pos] ?? 0) + 1;
    return c;
  }, [words]);

  const filtered = useMemo(() => {
    const withIdx = words.map((w, i) => ({ word: w, idx: i }));
    if (posFilter === "전체") return withIdx;
    return withIdx.filter((e) => e.word.pos === posFilter);
  }, [words, posFilter]);

  const levelLower = currentLevel.toLowerCase();

  return (
    <Layout>
      <div className="py-4">
        <h1 className="text-3xl font-bold mb-2">JLPT {currentLevel} 단어</h1>
        <p className="text-stone mb-6">
          {currentLevel} 레벨 필수 단어 {words.length}개
        </p>

        {/* 레벨 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {LEVELS.map((lv) => (
            <Link
              key={lv}
              to={`/vocab/${lv.toLowerCase()}`}
              className={`px-4 py-2 rounded-lg text-sm font-bold no-underline transition-colors ${
                lv === currentLevel
                  ? "bg-accent text-white"
                  : "border border-border text-stone hover:border-accent hover:text-accent"
              }`}
            >
              {lv}
            </Link>
          ))}
        </div>

        {/* 품사 필터 */}
        {!loading && !error && words.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setPosFilter("전체")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                posFilter === "전체"
                  ? "bg-ink text-paper"
                  : "border border-border text-stone hover:border-ink"
              }`}
            >
              전체 ({words.length})
            </button>
            {POS_ORDER.filter((p) => posCounts[p]).map((p) => (
              <button
                key={p}
                onClick={() => setPosFilter(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  posFilter === p
                    ? "bg-ink text-paper"
                    : "border border-border text-stone hover:border-ink"
                }`}
              >
                {p} ({posCounts[p]})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-stone-light">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-stone-light">{error}</div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.map((e) => (
              <VocabRow
                key={`${e.word.kana}-${e.word.kanji ?? "none"}-${e.idx}`}
                word={e.word}
                onOpen={() => navigate(`/vocab/${levelLower}/${e.idx}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
