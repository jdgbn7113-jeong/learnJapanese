import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import KanjiCard from "../components/kanji/KanjiCard";
import { useKanjiData } from "../hooks/useKanjiData";
import type { Kanji } from "../types/kanji";

type Category = "char" | "meaning" | "reading";

interface Grouped {
  char: Kanji[];
  meaning: Kanji[];
  reading: Kanji[];
}

function classify(kanji: Kanji, q: string): Category {
  if (kanji.char === q) return "char";
  if (kanji.meanings.some((m) => m.includes(q))) return "meaning";
  return "reading";
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const { search, loading } = useKanjiData();

  const { grouped, total } = useMemo(() => {
    const results = search(query);
    const g: Grouped = { char: [], meaning: [], reading: [] };
    for (const k of results) {
      g[classify(k, query.toLowerCase())].push(k);
    }
    return { grouped: g, total: results.length };
  }, [search, query]);

  if (!query) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">검색</h1>
          <p className="text-stone">상단 검색창에 한자, 뜻, 또는 읽기를 입력하세요.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
        <p className="text-stone mb-8">
          <span className="font-bold text-ink">"{query}"</span>에 대한 결과{" "}
          <span className="text-accent font-bold">{total}</span>건
        </p>

        {loading ? (
          <div className="text-center py-12 text-stone-light">로딩 중...</div>
        ) : total === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="space-y-10">
            <Section title="한자 일치" items={grouped.char} />
            <Section title="뜻 일치" items={grouped.meaning} />
            <Section title="읽기 일치" items={grouped.reading} />
          </div>
        )}
      </div>
    </Layout>
  );
}

function Section({ title, items }: { title: string; items: Kanji[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-bold mb-3 text-ink flex items-center gap-2">
        {title}
        <span className="text-xs font-normal text-stone-light">({items.length})</span>
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {items.map((k) => (
          <KanjiCard key={k.char} kanji={k} />
        ))}
      </div>
    </section>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-border rounded-xl">
      <p className="text-stone mb-2">
        <span className="font-bold text-ink">"{query}"</span>에 대한 결과가 없습니다.
      </p>
      <p className="text-sm text-stone-light mb-6">
        다른 키워드로 시도하거나 JLPT 목록에서 찾아보세요.
      </p>
      <div className="flex gap-2 justify-center">
        <Link
          to="/jlpt/n5"
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-bold no-underline hover:opacity-90 transition-opacity"
        >
          JLPT N5 둘러보기
        </Link>
      </div>
    </div>
  );
}
