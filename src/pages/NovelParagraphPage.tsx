import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import Layout from "../components/layout/Layout";
import { useNovelData } from "../hooks/useNovelData";
import { useReadSentences } from "../hooks/useReadSentences";

export default function NovelParagraphPage() {
  const { pid } = useParams<{ pid: string }>();
  const paragraphId = Number(pid);
  const { items, paragraphMap, loading } = useNovelData();
  const { isRead } = useReadSentences();

  const sentences = useMemo(
    () => items.filter((it) => it.paragraph === paragraphId),
    [items, paragraphId],
  );

  const readCount = useMemo(
    () => sentences.filter((s) => isRead(s.id)).length,
    [sentences, isRead],
  );

  const totalParagraphs = paragraphMap?.totalParagraphs ?? 0;
  const hasPrev = paragraphId > 1;
  const hasNext = paragraphId < totalParagraphs;

  return (
    <Layout>
      <div className="py-4">
        <Link
          to="/novel"
          className="text-sm text-stone hover:text-accent no-underline"
        >
          ← 문단 목록
        </Link>

        <div className="mt-6 mb-8 border-b border-border pb-5">
          <p className="text-xs tracking-[0.3em] text-accent font-bold mb-2">
            SOSEKI · こころ
          </p>
          <h1 className="font-serif text-3xl font-bold">
            제 {String(paragraphId).padStart(2, "0")} 단
          </h1>
          <p className="text-sm text-stone mt-1">
            {sentences.length} 문장
            {sentences.length > 0 && (
              <span className="ml-2 text-stone-light">
                · {readCount} / {sentences.length} 읽음
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-stone py-16">불러오는 중…</p>
        ) : sentences.length === 0 ? (
          <div className="text-center py-16 text-stone">
            <p className="mb-4">이 문단은 아직 준비 중입니다.</p>
            <Link to="/novel" className="text-accent no-underline">
              ← 문단 목록으로
            </Link>
          </div>
        ) : (
          <ol className="space-y-3">
            {sentences.map((item) => {
              const read = isRead(item.id);
              const cardClass = read
                ? "flex items-start gap-5 rounded-xl border border-border/60 bg-card/40 p-5 no-underline hover:border-accent transition-colors group"
                : "flex items-start gap-5 rounded-xl border border-border bg-card p-5 no-underline hover:border-accent transition-colors group";
              const idClass = read
                ? "font-serif text-2xl font-bold text-stone-light group-hover:text-accent w-14 shrink-0 tabular-nums"
                : "font-serif text-2xl font-bold text-accent-light group-hover:text-accent w-14 shrink-0 tabular-nums";
              const originalClass = read
                ? "font-serif text-lg text-stone leading-snug mb-2"
                : "font-serif text-lg text-ink leading-snug mb-2";
              return (
                <li key={item.id}>
                  <Link to={`/novel/${item.id}`} className={cardClass}>
                    <span className={idClass}>
                      {String(item.id).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={originalClass}>{item.original}</p>
                      <p className="text-sm text-stone">{item.meaning}</p>
                    </div>
                    {read && (
                      <span
                        className="text-accent shrink-0 mt-1"
                        aria-label="읽음"
                        title="읽음"
                      >
                        ✓
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        <div className="flex justify-between mt-10">
          {hasPrev ? (
            <Link
              to={`/novel/p/${paragraphId - 1}`}
              className="text-sm text-stone hover:text-accent no-underline"
            >
              ← 제 {String(paragraphId - 1).padStart(2, "0")} 단
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              to={`/novel/p/${paragraphId + 1}`}
              className="text-sm text-stone hover:text-accent no-underline"
            >
              제 {String(paragraphId + 1).padStart(2, "0")} 단 →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </Layout>
  );
}
