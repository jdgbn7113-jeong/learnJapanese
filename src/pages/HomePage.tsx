import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/search/SearchBar";

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export default function HomePage() {
  return (
    <Layout>
      <div className="text-center py-10">
        <h1 className="font-serif text-5xl font-bold mb-2">
          漢字<span className="text-accent-light">マスター</span>
        </h1>
        <p className="text-stone mb-8">
          부수 분해로 외우는 한자, 소설로 익히는 문장
        </p>

        <div className="max-w-md mx-auto mb-8">
          <SearchBar large />
        </div>

        {/* 세 개의 학습 공간 */}
        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto mb-10">
          <Link
            to="/novel"
            className="col-span-2 block rounded-2xl bg-ink text-paper py-5 no-underline shadow-sm hover:shadow-md active:scale-[0.985] transition-all duration-200"
          >
            <h3 className="font-semibold">소설로 배우기</h3>
          </Link>

          <Link
            to="/jlpt/n5"
            className="block rounded-2xl bg-card py-5 no-underline shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
          >
            <h3 className="font-semibold text-ink">한자</h3>
          </Link>

          <Link
            to="/vocab/n5"
            className="block rounded-2xl bg-card py-5 no-underline shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
          >
            <h3 className="font-semibold text-ink">단어</h3>
          </Link>
        </div>

        {/* JLPT 바로가기 */}
        <div>
          <h2 className="text-xs font-bold tracking-wider uppercase text-stone-light mb-3">
            JLPT 레벨별 학습
          </h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {JLPT_LEVELS.map((lv) => (
              <Link
                key={lv}
                to={`/jlpt/${lv.toLowerCase()}`}
                className="px-5 py-2 rounded-full bg-card text-ink font-semibold text-sm no-underline shadow-sm hover:bg-ink hover:text-paper hover:shadow-md active:scale-95 transition-all duration-200"
              >
                {lv}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
