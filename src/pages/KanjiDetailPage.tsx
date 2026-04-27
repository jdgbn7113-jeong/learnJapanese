import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RadicalCombiner from "../components/kanji/RadicalCombiner";
import MnemonicStory from "../components/kanji/MnemonicStory";
import ExampleWords from "../components/kanji/ExampleWords";
import PracticeSlot from "../components/canvas/PracticeSlot";
import { useKanjiData } from "../hooks/useKanjiData";

export default function KanjiDetailPage() {
  const { char } = useParams<{ char: string }>();
  const { getKanji, getAdjacent, loading } = useKanjiData();
  const kanji = char ? getKanji(char) : undefined;
  const { prev, next } = char ? getAdjacent(char) : {};

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center text-stone-light">로딩 중...</div>
      </Layout>
    );
  }

  if (!kanji) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <span className="font-serif text-[120px] leading-none font-bold text-ink block mb-6">
            {char}
          </span>
          <p className="text-stone text-lg mb-2">
            아직 등록되지 않은 한자입니다.
          </p>
          <p className="text-stone-light text-sm mb-6">
            학습 정보는 순차적으로 추가될 예정입니다.
          </p>
          <Link to="/" className="text-accent hover:underline">
            메인으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex gap-3 md:gap-5">
        {/* 왼쪽 이동 버튼 열 */}
        <div className="hidden md:block shrink-0 w-14">
          {prev && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/kanji/${prev}`}
                aria-label={`이전 한자: ${prev}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span className="font-serif text-base font-bold">{prev}</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* 가운데 본문 열 */}
        <div className="flex-1 min-w-0 py-4">
        {/* 모바일용 상단 이전/다음 버튼 */}
        <div className="flex md:hidden justify-between gap-2 mb-4">
          {prev ? (
            <Link
              to={`/kanji/${prev}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="font-serif font-bold">{prev}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              to={`/kanji/${next}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
            >
              <span className="font-serif font-bold">{next}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* 헤더: 한자 + 기본 정보 */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="text-center md:text-left shrink-0">
            <span className="font-serif text-[120px] leading-none font-bold text-ink block">
              {kanji.char}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-2">
              {kanji.meanings.join(", ")}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone mb-3">
              <span>
                <span className="text-stone-light">음독:</span>{" "}
                {kanji.readings.onyomi.join(", ") || "—"}
              </span>
              <span>
                <span className="text-stone-light">훈독:</span>{" "}
                {kanji.readings.kunyomi.join(", ") || "—"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {kanji.jlpt && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent">
                  {kanji.jlpt}
                </span>
              )}
              <span className="text-xs px-3 py-1 rounded-full bg-ink/5 text-stone">
                {kanji.strokes}획
              </span>
              {kanji.grade && (
                <span className="text-xs px-3 py-1 rounded-full bg-ink/5 text-stone">
                  {kanji.grade}학년 배정
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 본문: 부수 결합 + 연상 스토리 */}
        <div className="space-y-6 mb-8">
          <RadicalCombiner
            char={kanji.char}
            meanings={kanji.meanings}
            radicals={kanji.radicals}
            radicalRoles={kanji.mnemonic.radicalRoles}
          />
          <MnemonicStory mnemonic={kanji.mnemonic} />
        </div>

        {/* 필기 연습: 부수들 + 한자, 최대 3열로 wrap */}
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <div className="grid grid-cols-3 gap-4">
            {kanji.radicals.map((r, i) => (
              <PracticeSlot
                key={`r-${i}-${r.char}`}
                char={r.char}
                meaning={r.meaning}
              />
            ))}
            <PracticeSlot
              char={kanji.char}
              meaning={kanji.meanings[0]}
            />
          </div>
        </div>

        {/* 예제 단어 */}
        <div className="mt-8">
          <ExampleWords examples={kanji.examples} />
        </div>
        </div>

        {/* 오른쪽 이동 버튼 열 */}
        <div className="hidden md:block shrink-0 w-14">
          {next && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/kanji/${next}`}
                aria-label={`다음 한자: ${next}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  <span className="font-serif text-base font-bold">{next}</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
