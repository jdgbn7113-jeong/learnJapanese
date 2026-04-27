import Sidebar from "./Sidebar";
import Hero from "./Hero";
import SceneSection from "./SceneSection";

/**
 * Top-level landing page. Drop this into a route.
 * Image paths assume /public/landing/*.jpeg — adjust to your project.
 */
export default function KotonohaLanding() {
  return (
    <div className="min-h-screen bg-surface-bg font-sans text-ink antialiased">
      <Sidebar />

      <main className="ml-sidebar max-[860px]:ml-0">
        <Hero />

        <SceneSection
          tone="story"
          chapter="Chapter 01"
          meta="物語 · Story"
          jpHeader="小説で、すぐに学ぶ。"
          titleWords={["소설로", "바로", "배우는", "일본어."]}
          emWord="일본어."
          body={
            <>
              <strong>히라가나만 배우고 바로 시작하는 일본어 배우기!</strong>{" "}
              소설 원문을 직접 공부하면서 배우세요. 문장마다 맞춤 어휘 · 문법 · 직역 · 의역 · 후리가나가 있어서 귀찮게 검색할 필요가 없습니다. 실제 문학 작품의 문장들을 통해 일본어를 배우세요.
            </>
          }
          tag="Story-driven · Furigana"
          image={{ src: "/landing/book.jpeg", alt: "소설 — 책" }}
          leaves={[
            { text: "、", pos: "tl", rot: -8 },
            { text: "。", pos: "tr", rot: 12 },
            { text: "語", pos: "bl", rot: 6 },
            { text: "文", pos: "br", rot: -10 },
          ]}
        />

        <SceneSection
          reverse
          tone="words"
          chapter="Chapter 02"
          meta="言葉 · Words"
          jpHeader="すべての言葉が、リンクに。"
          titleWords={["소설에", "있는", "모든", "단어들이", "링크."]}
          emWord="링크."
          body={
            <>
              소설에 등장하는 모든 한자와 단어는 <strong>클릭 한 번</strong>으로 확인할 수 있습니다. 단어의 뜻 · 음훈 · JLPT 레벨, 같은 단어가 쓰인 다른 문장 목록이 펼쳐집니다. 읽다가 사전을 따로 검색할 필요가 없습니다.
            </>
          }
          tag="One-click dictionary"
          image={{ src: "/landing/words.jpeg", alt: "단어 카드" }}
          leaves={[
            { text: "語", pos: "tl", rot: -8 },
            { text: "→",  pos: "tr", rot: 12 },
            { text: "訳", pos: "bl", rot: 6 },
            { text: "音", pos: "br", rot: -10 },
          ]}
        />

        <SceneSection
          tone="kanji"
          chapter="Chapter 03"
          meta="漢字 · Kanji"
          jpHeader="部首から、手で書く。"
          titleWords={["부수의", "의미까지,", "손으로", "쓰는", "한자."]}
          emWord="한자."
          body={
            <>
              한자를 <strong>부수 단위로 분해</strong>해 보여주고, 각 부수의 뜻과 의미가 한 페이지에 정리되어 있습니다. 페이지 아래의 캔버스에서 부수와 한자를 직접 따라 써 볼 수 있습니다.
            </>
          }
          tag="Radicals · Handwriting"
          glyph="漢"
          leaves={[
            { text: "氵", pos: "tl", rot: -8 },
            { text: "木", pos: "tr", rot: 12 },
            { text: "心", pos: "bl", rot: 6 },
            { text: "日", pos: "br", rot: -10 },
          ]}
        />

        <div className="mx-16 mt-10 border-t border-line pb-8 pt-12 text-center text-ink-faint max-[860px]:mx-5">
          <div className="mb-1.5 font-jp text-[13px] font-medium tracking-[0.4em] text-ink-soft">
            毎日すこしずつ
          </div>
          <div className="text-xs font-semibold tracking-wide">
            © Kotonoha — 매일 한 장의 일본어
          </div>
        </div>
      </main>
    </div>
  );
}
