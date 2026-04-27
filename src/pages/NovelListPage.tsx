import { Link } from "react-router-dom";
import { useMemo } from "react";
import Layout from "../components/layout/Layout";
import { useNovelData } from "../hooks/useNovelData";
import { useReadSentences } from "../hooks/useReadSentences";

export default function NovelListPage() {
  const { items, paragraphMap, loading } = useNovelData();
  const { isRead } = useReadSentences();

  const totalParagraphs = paragraphMap?.totalParagraphs ?? 0;

  const countsByParagraph = useMemo(() => {
    const map = new Map<number, number>();
    for (const it of items) {
      map.set(it.paragraph, (map.get(it.paragraph) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const readByParagraph = useMemo(() => {
    const map = new Map<number, number>();
    for (const it of items) {
      if (isRead(it.id)) {
        map.set(it.paragraph, (map.get(it.paragraph) ?? 0) + 1);
      }
    }
    return map;
  }, [items, isRead]);

  const lastFilledParagraph = useMemo(() => {
    let max = 0;
    for (const pid of countsByParagraph.keys()) {
      if (pid > max) max = pid;
    }
    return max;
  }, [countsByParagraph]);

  const visibleCount = Math.min(lastFilledParagraph + 1, totalParagraphs);

  return (
    <Layout>
      <div className="py-4">
        <div className="mb-10 border-b border-border pb-6">
          <p className="text-xs tracking-[0.3em] text-accent font-bold mb-2">
            SOSEKI · こころ
          </p>
          <h1 className="font-serif text-4xl font-bold mb-2">
            소설로 배우는 일본어
          </h1>
          <p className="text-stone">
            나쓰메 소세키 『마음(こころ)』을 문단별로 읽어 나갑니다. 원문 ·
            히라가나 · 어휘 · 문법 · 해설까지.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-stone py-16">불러오는 중…</p>
        ) : (
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: visibleCount }, (_, i) => i + 1).map(
              (pid) => {
                const count = countsByParagraph.get(pid) ?? 0;
                const read = readByParagraph.get(pid) ?? 0;
                const active = count > 0;
                const label = `제 ${String(pid).padStart(2, "0")} 단`;
                const caption = active
                  ? `${read} / ${count} 읽음`
                  : "추가 예정";
                const allRead = active && read >= count;

                const cardClass =
                  "flex flex-col items-start rounded-xl border p-4 transition-colors";

                return (
                  <li key={pid}>
                    {active ? (
                      <Link
                        to={`/novel/p/${pid}`}
                        className={`${cardClass} ${allRead ? "border-border/60 bg-card/40" : "border-border bg-card"} no-underline hover:border-accent group`}
                      >
                        <span
                          className={`font-serif text-lg font-bold tabular-nums group-hover:text-accent ${allRead ? "text-stone-light" : "text-accent-light"}`}
                        >
                          {label}
                          {allRead && (
                            <span className="ml-1 text-accent" aria-label="모두 읽음" title="모두 읽음">
                              ✓
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-stone mt-1">
                          {caption}
                        </span>
                      </Link>
                    ) : (
                      <div
                        className={`${cardClass} border-dashed border-border bg-transparent opacity-60 cursor-not-allowed`}
                        aria-disabled
                      >
                        <span className="font-serif text-lg font-bold text-stone-light tabular-nums">
                          {label}
                        </span>
                        <span className="text-xs text-stone-light mt-1">
                          {caption}
                        </span>
                      </div>
                    )}
                  </li>
                );
              },
            )}
          </ol>
        )}
      </div>
    </Layout>
  );
}
