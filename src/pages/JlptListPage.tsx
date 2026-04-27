import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import KanjiCard from "../components/kanji/KanjiCard";
import { useKanjiData } from "../hooks/useKanjiData";

const LEVELS = ["n5", "n4", "n3", "n2", "n1"];

export default function JlptListPage() {
  const { level } = useParams<{ level: string }>();
  const { getByJlpt, loading } = useKanjiData();

  const currentLevel = level?.toUpperCase() ?? "N5";
  const kanjiList = getByJlpt(currentLevel);

  return (
    <Layout>
      <div className="py-4">
        <h1 className="text-3xl font-bold mb-2">JLPT {currentLevel}</h1>
        <p className="text-stone mb-6">
          {currentLevel} 레벨 한자 {kanjiList.length}자
        </p>

        {/* 레벨 탭 */}
        <div className="flex gap-2 mb-8">
          {LEVELS.map((lv) => (
            <Link
              key={lv}
              to={`/jlpt/${lv}`}
              className={`px-4 py-2 rounded-lg text-sm font-bold no-underline transition-colors ${
                lv === level
                  ? "bg-accent text-white"
                  : "border border-border text-stone hover:border-accent hover:text-accent"
              }`}
            >
              {lv.toUpperCase()}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-light">로딩 중...</div>
        ) : kanjiList.length === 0 ? (
          <div className="text-center py-12 text-stone-light">
            {currentLevel} 레벨 데이터는 아직 준비 중입니다.
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {kanjiList.map((k) => (
              <KanjiCard key={k.char} kanji={k} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
