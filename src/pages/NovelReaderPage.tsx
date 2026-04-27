import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SentenceTraceCanvas from "../components/canvas/SentenceTraceCanvas";
import { useNovelData } from "../hooks/useNovelData";
import { useReadSentences } from "../hooks/useReadSentences";
import type { NovelSentence } from "../types/novel";

type RubyToken = { t: string; r?: string };
type RubyPattern = { display: string; furigana: string };

function buildRubyPatterns(vocab: NovelSentence["vocab"]): RubyPattern[] {
  // vocab에서 가능한 인라인 furigana 패턴 추출:
  //   (1) kanji + reading — 단어 전체가 인라인으로 붙은 경우
  //   (2) kanji_head + reading_head — 오쿠리가나가 있는 경우(예: 憚る/はばかる → 憚/はばか)
  const patterns: RubyPattern[] = [];
  for (const v of vocab) {
    patterns.push({ display: v.kanji, furigana: v.reading });
    const m = v.kanji.match(/^([\u4e00-\u9fff々ヶ]+)(.*)$/);
    if (m && m[2] && v.reading.endsWith(m[2])) {
      patterns.push({
        display: m[1],
        furigana: v.reading.slice(0, -m[2].length),
      });
    }
  }
  // 중복 제거 + 긴 패턴 우선 (빈 furigana 패턴은 제외)
  const seen = new Set<string>();
  return patterns
    .filter((p) => {
      if (!p.furigana) return false;
      const key = p.display + "|" + p.furigana;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        b.display.length +
        b.furigana.length -
        (a.display.length + a.furigana.length),
    );
}

function parseOriginalWithFurigana(
  original: string,
  vocab: NovelSentence["vocab"],
): RubyToken[] {
  const patterns = buildRubyPatterns(vocab);
  const tokens: RubyToken[] = [];
  let i = 0;
  while (i < original.length) {
    let matched = false;
    for (const p of patterns) {
      const combined = p.display + p.furigana;
      if (original.startsWith(combined, i)) {
        tokens.push({ t: p.display, r: p.furigana });
        i += combined.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = tokens[tokens.length - 1];
      if (last && !last.r) {
        last.t += original[i];
      } else {
        tokens.push({ t: original[i] });
      }
      i++;
    }
  }
  return tokens;
}

function OriginalWithRuby({
  original,
  vocab,
}: {
  original: string;
  vocab: NovelSentence["vocab"];
}) {
  const tokens = parseOriginalWithFurigana(original, vocab);
  return (
    <p className="font-serif text-3xl leading-[2.2]">
      {tokens.map((tok, i) =>
        tok.r ? (
          <ruby key={i}>
            {tok.t}
            <rt className="text-[0.4em] tracking-wider text-accent font-normal">
              {tok.r}
            </rt>
          </ruby>
        ) : (
          <span key={i}>{tok.t}</span>
        ),
      )}
    </p>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-ink text-lg">{title}</h2>
    </div>
  );
}

function HiraganaLine({ tokens }: { tokens: NovelSentence["hiragana"] }) {
  return (
    <p className="font-serif text-xl leading-loose text-ink">
      {tokens.map((tok, i) =>
        tok.e ? (
          <span
            key={i}
            className="text-accent font-bold border-b-2 border-accent/40"
          >
            {tok.t}
          </span>
        ) : (
          <span key={i}>{tok.t}</span>
        ),
      )}
    </p>
  );
}

function VocabTable({ rows }: { rows: NovelSentence["vocab"] }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left">
        <thead className="bg-card">
          <tr className="text-xs tracking-wider uppercase text-stone-light">
            <th className="px-4 py-3 font-bold">한자</th>
            <th className="px-4 py-3 font-bold">발음</th>
            <th className="px-4 py-3 font-bold">의미</th>
            <th className="px-4 py-3 font-bold w-20"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const hasRef = !!row.ref;
            const onClick = row.ref
              ? () =>
                  navigate(
                    `/vocab/${row.ref!.level.toLowerCase()}/${row.ref!.index}`,
                  )
              : undefined;
            return (
              <tr
                key={i}
                onClick={onClick}
                onKeyDown={
                  onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onClick();
                        }
                      }
                    : undefined
                }
                role={hasRef ? "button" : undefined}
                tabIndex={hasRef ? 0 : undefined}
                className={`border-t border-border transition-colors ${
                  hasRef
                    ? "cursor-pointer hover:bg-accent/5 focus:bg-accent/5 focus:outline-none group"
                    : "hover:bg-card/60"
                }`}
              >
                <td
                  className={`px-4 py-3 font-serif text-lg font-bold ${
                    hasRef ? "text-ink group-hover:text-accent transition-colors" : "text-ink"
                  }`}
                >
                  {row.kanji}
                </td>
                <td className="px-4 py-3 font-serif text-ink">{row.reading}</td>
                <td className="px-4 py-3 text-sm text-stone">{row.meaning}</td>
                <td className="px-4 py-3 text-right">
                  {hasRef && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-accent/70 group-hover:text-accent transition-colors">
                      <span className="hidden md:inline">단어 학습</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GrammarList({ rows }: { rows: NovelSentence["grammar"] }) {
  return (
    <ul className="space-y-3">
      {rows.map((row, i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="font-serif text-base font-bold text-accent mb-1">
            {row.element}
          </div>
          <p className="text-sm text-stone leading-relaxed">{row.desc}</p>
        </li>
      ))}
    </ul>
  );
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

function Notes({ notes }: { notes: NovelSentence["notes"] }) {
  return (
    <div className="space-y-3">
      {notes.map((n, i) => (
        <div
          key={i}
          className="rounded-lg border-l-4 border-accent-light bg-card/70 p-4"
        >
          {n.title && (
            <div className="font-bold text-ink mb-1">{n.title}</div>
          )}
          <p className="text-sm text-stone leading-relaxed">{n.body}</p>
        </div>
      ))}
    </div>
  );
}

const TRANSLATION_LABELS: Record<string, string> = {
  literal: "直譯 · 직역",
  liberal: "意譯 · 의역",
};

function TranslationStack({
  translations,
}: {
  translations: NonNullable<NovelSentence["translations"]>;
}) {
  const order: Array<keyof typeof translations> = ["literal", "liberal"];
  return (
    <div className="space-y-2">
      {order.map((key) => (
        <div
          key={key}
          className="rounded-lg border border-border bg-card p-4 flex flex-col md:flex-row md:items-baseline md:gap-5"
        >
          <div className="shrink-0 text-xs font-bold tracking-[0.25em] text-accent mb-1 md:mb-0 md:w-24">
            {TRANSLATION_LABELS[key]}
          </div>
          <p className="text-ink text-base leading-relaxed">
            {translations[key]}
          </p>
        </div>
      ))}
    </div>
  );
}

function VocabDeepBlock({
  items,
}: {
  items: NonNullable<NovelSentence["vocabDeep"]>;
}) {
  return (
    <div className="space-y-3 mt-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-lg border-l-4 border-accent bg-card p-4"
        >
          <div className="font-serif text-base font-bold text-ink mb-1">
            <span className="text-accent mr-2">
              {String(i + 1).padStart(2, "0")}
            </span>
            {it.word}
          </div>
          <p className="text-sm text-stone leading-relaxed">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

function ContextBlock({
  context,
}: {
  context: NonNullable<NovelSentence["context"]>;
}) {
  return (
    <div className="space-y-3">
      {(context.before || context.after) && (
        <div className="rounded-lg bg-card border border-border p-5 space-y-3">
          {context.before && (
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-light mb-1">
                이전 흐름
              </div>
              <p className="text-sm text-stone leading-relaxed">
                {context.before}
              </p>
            </div>
          )}
          {context.after && (
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-light mb-1">
                이후 흐름
              </div>
              <p className="text-sm text-stone leading-relaxed">
                {context.after}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-4">
        <div className="text-xs font-bold tracking-wider uppercase text-accent mb-1">
          이 문장의 역할
        </div>
        <p className="text-sm text-ink leading-relaxed">{context.summary}</p>
      </div>
    </div>
  );
}

export default function NovelReaderPage() {
  const { id } = useParams<{ id: string }>();
  const currentId = Number(id);
  const { items, loading } = useNovelData();
  const { markRead } = useReadSentences();

  const current = items.find((it) => it.id === currentId);

  useEffect(() => {
    if (current) markRead(current.id);
  }, [current, markRead]);
  const paragraphSentences = current
    ? items.filter((it) => it.paragraph === current.paragraph)
    : [];
  const currentIndexInParagraph = paragraphSentences.findIndex(
    (it) => it.id === currentId,
  );
  const prev =
    currentIndexInParagraph > 0
      ? paragraphSentences[currentIndexInParagraph - 1]
      : undefined;
  const next =
    currentIndexInParagraph >= 0 &&
    currentIndexInParagraph < paragraphSentences.length - 1
      ? paragraphSentences[currentIndexInParagraph + 1]
      : undefined;

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-stone py-16">불러오는 중…</p>
      </Layout>
    );
  }

  if (!current) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <p className="text-stone mb-4">문장을 찾을 수 없습니다.</p>
          <Link to="/novel" className="text-accent no-underline">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  const prevLabel = prev ? `第 ${String(prev.id).padStart(2, "0")} 文` : "";
  const nextLabel = next ? `第 ${String(next.id).padStart(2, "0")} 文` : "";

  return (
    <Layout>
      <div className="flex gap-3 md:gap-5">
        {/* 왼쪽 이동 버튼 */}
        <div className="hidden md:block shrink-0 w-14">
          {prev && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/novel/${prev.id}`}
                aria-label={`이전 문장: ${prevLabel}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <NavArrow dir="prev" />
                  <span className="font-serif text-xs font-bold whitespace-nowrap">
                    第 {String(prev.id).padStart(2, "0")}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 py-4">
          {/* 모바일 상단 이전/다음 */}
          <div className="flex md:hidden justify-between gap-2 mb-4">
            {prev ? (
              <Link
                to={`/novel/${prev.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
              >
                <NavArrow dir="prev" />
                <span className="font-serif font-bold">{prevLabel}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                to={`/novel/${next.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card border border-border text-stone hover:border-accent hover:text-accent transition-colors no-underline"
              >
                <span className="font-serif font-bold">{nextLabel}</span>
                <NavArrow dir="next" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          {/* 상단 내비 (목록으로 + 카운터) */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to={`/novel/p/${current.paragraph}`}
              className="text-sm text-stone hover:text-accent no-underline"
            >
              ← 제 {String(current.paragraph).padStart(2, "0")} 단 목차
            </Link>
            <span className="text-xs tracking-[0.3em] text-stone-light">
              제 {String(current.paragraph).padStart(2, "0")} 단 · 제{" "}
              {String(currentIndexInParagraph + 1).padStart(2, "0")} 문 /{" "}
              {paragraphSentences.length}
            </span>
          </div>

          {/* 원문 */}
          <div className="mb-10 rounded-2xl bg-card text-ink p-8 border border-border border-l-4 border-l-accent">
            <OriginalWithRuby
              original={current.original}
              vocab={current.vocab}
            />
          </div>

          {/* 섹션들 */}
          <div className="space-y-10">
            <section>
              <div className="rounded-xl bg-card border border-border p-6">
                <HiraganaLine tokens={current.hiragana} />
              </div>
            </section>

            {current.translations && (
              <section>
                <TranslationStack translations={current.translations} />
              </section>
            )}

            {/* 필사 캔버스 */}
            <SentenceTraceCanvas sentence={current.original} />


            <section>
              <SectionHeading title="한자 배우기" />
              <VocabTable rows={current.vocab} />
              {current.vocabDeep && current.vocabDeep.length > 0 && (
                <>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-stone-light mt-6 mb-2">
                    핵심 단어 심화
                  </h3>
                  <VocabDeepBlock items={current.vocabDeep} />
                </>
              )}
            </section>

            <section>
              <SectionHeading title="문법" />
              <GrammarList rows={current.grammar} />
            </section>

            {current.context && (
              <section>
                <SectionHeading title="맥락과 역할" />
                <ContextBlock context={current.context} />
              </section>
            )}

            {current.notes.length > 0 && (
              <section>
                <SectionHeading title="특이점" />
                <Notes notes={current.notes} />
              </section>
            )}
          </div>
        </div>

        {/* 오른쪽 이동 버튼 */}
        <div className="hidden md:block shrink-0 w-14">
          {next && (
            <div className="sticky top-[calc(50vh-3rem)]">
              <Link
                to={`/novel/${next.id}`}
                aria-label={`다음 문장: ${nextLabel}`}
                className="flex items-center justify-center w-14 h-24 rounded-xl bg-card border border-border text-stone hover:text-accent hover:border-accent hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col items-center gap-1">
                  <NavArrow dir="next" />
                  <span className="font-serif text-xs font-bold whitespace-nowrap">
                    第 {String(next.id).padStart(2, "0")}
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
