import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "public", "data");
const kanjiPath = join(dataDir, "kanji.json");
const novelPath = join(dataDir, "novel.json");
const novelParaPath = join(dataDir, "novel-paragraphs.json");
const vocabPath = (lv) => join(dataDir, `vocab-${lv.toLowerCase()}.json`);

const kanji = JSON.parse(readFileSync(kanjiPath, "utf8"));
const novel = JSON.parse(readFileSync(novelPath, "utf8"));
const paraMap = JSON.parse(readFileSync(novelParaPath, "utf8"));
const vocab = {};
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  vocab[lv] = JSON.parse(readFileSync(vocabPath(lv), "utf8"));
}

// ===== 1. New kanji =====
const nk = (char, on, kun, mean, jlpt, grade, strokes, rads, story, keyImage, examples) => ({
  char,
  readings: { onyomi: on, kunyomi: kun },
  meanings: mean,
  jlpt,
  grade,
  strokes,
  radicals: rads.map(([c, m, p]) => ({ char: c, meaning: m, position: p })),
  mnemonic: {
    radicalRoles: rads.map(([c, m]) => ({ char: c, persona: m })),
    story,
    keyImage,
  },
  examples,
});

const newKanji = {
  "階": nk(
    "階", ["カイ"], ["きざはし"], ["계단", "층"], "N3", 3, 12,
    [["阝", "언덕(좌부방)", "left"], ["皆", "모두·가지런히", "right"]],
    "阝(언덕) 쪽에 皆(모두 가지런히) 늘어선 단 — 한 칸씩 올라가는 계단.",
    "언덕에 가지런히 놓인 단 = 계단",
    [
      { word: "階段", reading: "かいだん", meaning: "계단" },
      { word: "二階", reading: "にかい", meaning: "이층" },
    ],
  ),
  "性": nk(
    "性", ["セイ", "ショウ"], ["さが"], ["성질", "성별"], "N3", 5, 8,
    [["忄", "마음(심방변)", "left"], ["生", "태어나다·삶", "right"]],
    "忄(마음)이 生(타고날 때부터) 지니는 것 — 본성, 성별, 성질.",
    "타고난 마음 = 성(性)",
    [
      { word: "性質", reading: "せいしつ", meaning: "성질" },
      { word: "異性", reading: "いせい", meaning: "이성" },
      { word: "同性", reading: "どうせい", meaning: "동성" },
    ],
  ),
  "序": nk(
    "序", ["ジョ"], ["ついで"], ["차례", "서문"], "N2", 5, 7,
    [["广", "집(엄호)", "outer"], ["予", "미리·나", "inner"]],
    "广(집) 안에서 予(미리) 정해 둔 차례 — 순서, 서열.",
    "집안의 미리 정한 차례 = 순서",
    [
      { word: "順序", reading: "じゅんじょ", meaning: "순서" },
      { word: "序文", reading: "じょぶん", meaning: "서문" },
    ],
  ),
  "貸": nk(
    "貸", ["タイ"], ["か-す"], ["빌려주다"], "N4", 5, 12,
    [["代", "대신·바꾸다", "top"], ["貝", "조개·돈", "bottom"]],
    "代(대신) 貝(재물)을 내주어 잠시 맡기는 것 — 빌려주다.",
    "대신 돈을 내주다 = 빌려주다",
    [
      { word: "貸す", reading: "かす", meaning: "빌려주다" },
      { word: "賃貸", reading: "ちんたい", meaning: "임대" },
    ],
  ),
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ===== 2. New vocab =====
const newVocab = {
  N5: [
    { kana: "かなしい", kanji: "悲しい", meaning: "슬프다", pos: "い형용사" },
  ],
  N4: [
    { kana: "のぼる", kanji: "上る", meaning: "오르다", pos: "동사" },
  ],
  N3: [
    { kana: "じゅんじょ", kanji: "順序", meaning: "순서", pos: "명사" },
    { kana: "せいしつ", kanji: "性質", meaning: "성질", pos: "명사" },
    { kana: "おきのどく", kanji: "お気の毒", meaning: "딱함, 안쓰러움", pos: "명사·な형용사" },
    { kana: "よそ", kanji: "よそ", meaning: "다른 곳, 딴 데", pos: "명사" },
  ],
  N2: [
    { kana: "いせい", kanji: "異性", meaning: "이성", pos: "명사" },
    { kana: "だきあう", kanji: "抱き合う", meaning: "서로 껴안다", pos: "동사" },
    { kana: "どうせい", kanji: "同性", meaning: "동성", pos: "명사" },
    { kana: "ことにする", kanji: "異にする", meaning: "달리하다", pos: "동사" },
    { kana: "なおさら", kanji: "なおさら", meaning: "더더욱, 한층 더", pos: "부사" },
  ],
  N1: [],
};

const idx = {};
for (const [lv, items] of Object.entries(newVocab)) {
  const arr = vocab[lv].words;
  for (const item of items) {
    arr.push(item);
    idx[item.kanji] = { level: lv, index: arr.length - 1 };
  }
}

// Refs table (existing + new)
const ref = {
  "今": { level: "N5", index: 68 },
  "動く": { level: "N5", index: 80 },
  "物足りない": { level: "N2", index: 122 },
  "結果": { level: "N3", index: 238 },
  "私": { level: "N3", index: 43 },
  "所": { level: "N5", index: 407 },
  "来る": { level: "N5", index: 215 },
  "あなた": { level: "N5", index: 23 },
  "知る": { level: "N5", index: 316 },
  "恋": { level: "N4", index: 229 },
  "違う": { level: "N5", index: 370 },
  "階段": { level: "N5", index: 147 },
  "まず": { level: "N3", index: 145 },
  "二つ": { level: "N5", index: 521 },
  "全く": { level: "N3", index: 147 },
  "思う": { level: "N5", index: 135 },
  "同じ": { level: "N5", index: 124 },
  "男": { level: "N5", index: 117 },
  "満足": { level: "N3", index: 134 },
  "与える": { level: "N3", index: 143 },
  "人間": { level: "N4", index: 79 },
  "特別": { level: "N4", index: 19 },
  "事情": { level: "N3", index: 37 },
  "実際": { level: "N3", index: 13 },
  "行く": { level: "N5", index: 43 },
  "仕方": { level: "N4", index: 219 },
  "むしろ": { level: "N3", index: 66 },
  "希望": { level: "N3", index: 154 },
  "変": { level: "N5", index: 672 },
  "先生": { level: "N5", index: 337 },
  "離れる": { level: "N3", index: 132 },
  "気": { level: "N5", index: 722 },
  "起こる": { level: "N4", index: 44 },
  "事": { level: "N5", index: 240 },
  "言葉": { level: "N5", index: 637 },
  "耳": { level: "N5", index: 564 },
  "貸す": { level: "N5", index: 158 },
};
Object.assign(ref, idx);

const V = (k, r, m, word) => ({
  kanji: k,
  reading: r,
  meaning: m,
  ...(ref[word ?? k] ? { ref: ref[word ?? k] } : {}),
});

// ===== 3. Sentences 520-528 =====
const h = (t, e = false) => ({ t, e });

const sentences = [
  {
    id: 520,
    paragraph: 13,
    original: "「今それほど動いちゃいません」",
    hiragana: [
      h("「 ", false),
      h("いま", true), h("それほど ", false),
      h("うご", true), h("いちゃいません」", false),
    ],
    meaning: "「지금은 그렇게까지 움직이고 있지는 않습니다」",
    vocab: [
      V("今", "いま", "지금"),
      V("動く", "うごく", "움직이다"),
    ],
    grammar: [
      {
        element: "動いちゃいません",
        desc: "「〜てはいない」의 구어 축약. 「〜ちゃ」=「〜ては」. '움직이고 있지는 않다'는 부분 부정·뉘앙스 약화.",
      },
      { element: "それほど〜ない", desc: "'그렇게까지 ~지는 않다'. 정도를 약하게 부정하는 상관구문." },
    ],
    notes: [
      {
        title: "화자의 즉각적 부인",
        body: "516 「もう解っているはず」, 519 「動きたくなるのです」에 대한 화자의 즉각적 반박. 그러나 '전혀'가 아니라 '그렇게까지는'이라고 약하게 부정한 점이 중요 — 완전 부인은 아니다.",
      },
    ],
    translations: {
      literal: "「지금은 그 정도로 움직이고 있지는 않습니다」",
      liberal: "「지금 제 마음이 그 정도로까지 흔들리고 있지는 않습니다」",
    },
  },
  {
    id: 521,
    paragraph: 13,
    original: "「あなたは物足りない結果私の所に動いて来たじゃありませんか」",
    hiragana: [
      h("「あなたは ", false),
      h("ものた", true), h("りない ", false),
      h("けっか", true), h(" ", false),
      h("わたくし", true), h("の ", false),
      h("ところ", true), h("に ", false),
      h("うご", true), h("いて ", false),
      h("き", true), h("たじゃありませんか」", false),
    ],
    meaning: "「당신은 무언가 부족했던 결과 내 곳으로 움직여 온 것 아닙니까」",
    vocab: [
      V("あなた", "あなた", "당신"),
      V("物足りない", "ものたりない", "어딘가 부족하다"),
      V("結果", "けっか", "결과"),
      V("私", "わたくし", "나"),
      V("所", "ところ", "곳"),
      V("動く", "うごく", "움직이다"),
      V("来る", "くる", "오다"),
    ],
    grammar: [
      { element: "物足りない結果", desc: "「물족스럽지 않은 결과 = 무언가 부족했기 때문에」. 형용사가 명사를 수식하며 인과를 형성." },
      { element: "私の所に動いて来た", desc: "「사람이 '움직여 온다'」는 이 단락의 키워드. 사랑의 동학을 물리적 이동으로 표현." },
      {
        element: "〜じゃありませんか",
        desc: "'~잖습니까'. 상대가 스스로 인정할 만한 사실을 되돌려 주는 반문. 선생님이 화자의 행동을 증거로 제시.",
      },
    ],
    notes: [
      {
        title: "선생님의 역증거",
        body: "화자가 '지금은 움직이지 않는다'고 말하자, 선생님은 '이미 나에게 찾아왔다는 것 자체가 움직임의 결과'라고 되받는다. 행동을 '감정의 증거'로 되돌리는 구조.",
      },
    ],
    translations: {
      literal: "「자네는 무언가 만족스럽지 못한 결과 내 집으로 움직여 온 것 아닌가」",
      liberal:
        "「자네는 어딘가 채워지지 않는 구석이 있었기에 내 집으로까지 찾아와 발걸음을 옮긴 것이 아닌가 말일세」",
    },
  },
  {
    id: 522,
    paragraph: 13,
    original: "「それはそうかも知れません。しかしそれは恋とは違います」",
    hiragana: [
      h("「それはそうかも ", false),
      h("し", true), h("れません。しかしそれは ", false),
      h("こい", true), h("とは ", false),
      h("ちが", true), h("います」", false),
    ],
    meaning: "「그것은 그럴지도 모릅니다. 그러나 그것은 사랑과는 다릅니다」",
    vocab: [
      V("知る", "しる", "알다"),
      V("恋", "こい", "사랑"),
      V("違う", "ちがう", "다르다"),
    ],
    grammar: [
      { element: "〜かも知れません", desc: "'~지도 모릅니다'. 가능성을 인정하면서 동시에 단정을 피하는 완곡 표현." },
      { element: "Aとは違う", desc: "「と」 비교 조사 + 「は」 주제화. 'A와는 다르다' — 두 대상을 명확히 구분." },
    ],
    notes: [
      {
        title: "부분 인정 + 경계 긋기",
        body: "화자는 '찾아간 것 자체'는 인정하지만, 그것을 '사랑'이라 부르는 것에는 선을 긋는다. 다음 문장에서 선생님은 바로 이 선을 허물 것이다.",
      },
    ],
    translations: {
      literal: "「그것은 그럴지도 모릅니다. 그러나 그것은 사랑과는 다른 것입니다」",
      liberal:
        "「그 말씀은 혹 그럴지도 모르겠습니다. 그렇지만 그것과 사랑은 엄연히 다른 것이지요」",
    },
  },
  {
    id: 523,
    paragraph: 13,
    original:
      "「恋に上のぼる楷段かいだんなんです。異性と抱き合う順序として、まず同性の私の所へ動いて来たのです」",
    hiragana: [
      h("「 ", false),
      h("こい", true), h("に ", false),
      h("のぼ", true), h("る ", false),
      h("かいだん", true), h("なんです。 ", false),
      h("いせい", true), h("と ", false),
      h("だ", true), h("き ", false),
      h("あ", true), h("う ", false),
      h("じゅんじょ", true), h("として、まず ", false),
      h("どうせい", true), h("の ", false),
      h("わたくし", true), h("の ", false),
      h("ところ", true), h("へ ", false),
      h("うご", true), h("いて ", false),
      h("き", true), h("たのです」", false),
    ],
    meaning:
      "「사랑으로 오르는 계단인 것입니다. 이성과 끌어안는 순서로서, 먼저 동성인 내 곳으로 움직여 온 것입니다」",
    vocab: [
      V("恋", "こい", "사랑"),
      V("上る", "のぼる", "오르다"),
      V("階段", "かいだん", "계단", "階段"),
      V("異性", "いせい", "이성"),
      V("抱き合う", "だきあう", "서로 껴안다"),
      V("順序", "じゅんじょ", "순서"),
      V("まず", "まず", "먼저, 우선"),
      V("同性", "どうせい", "동성"),
      V("私", "わたくし", "나"),
      V("所", "ところ", "곳"),
      V("動く", "うごく", "움직이다"),
      V("来る", "くる", "오다"),
    ],
    grammar: [
      {
        element: "恋に上る楷段",
        desc: "「恋」를 위층, 지금의 행동을 '오르는 계단(楷段=階段)'으로 은유. 사랑을 목적지로, 친분을 그 과정으로 설정.",
      },
      { element: "〜として", desc: "'~로서'. 역할·자격을 규정하는 격조사 용법. 동성 친분을 이성애의 '순서'로 자리매김." },
      { element: "異性と抱き合う", desc: "「と」 상호 조사. 서로 껴안는다는 상호 행위를 나타냄." },
    ],
    notes: [
      {
        title: "「楷段」 표기",
        body: "소세키의 원문 표기로, 현대 표준 표기는 「階段」. 후리가나 「かいだん」이 달려 있어 의미는 동일. 본 앱의 vocab 링크는 「階段」(N5)로 연결.",
      },
      {
        title: "선생님의 사랑관",
        body: "동성 친분 → 이성 사랑을 '계단'으로 연결하는 이 구도는 소세키 시대의 남성 우정/학생 문화를 반영. 화자의 방문 자체가 이미 사랑의 '준비 운동'이라는 도발적 주장.",
      },
    ],
    translations: {
      literal:
        "「사랑으로 오르는 계단이라네. 이성과 끌어안는 순서로서, 먼저 동성인 내 집으로 움직여 온 것이네」",
      liberal:
        "「사랑에 이르는 층계를 오르는 중이란 말일세. 이성과 서로를 껴안기에 앞서 그 차례로, 우선 같은 성인 내 집으로 발을 옮겨 온 것이지」",
    },
  },
  {
    id: 524,
    paragraph: 13,
    original: "「私には二つのものが全く性質を異ことにしているように思われます」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("には ", false),
      h("ふた", true), h("つのものが ", false),
      h("まった", true), h("く ", false),
      h("せいしつ", true), h("を ", false),
      h("こと", true), h("にしているように ", false),
      h("おも", true), h("われます」", false),
    ],
    meaning: "「제게는 그 두 가지가 완전히 성질을 달리하고 있는 것처럼 생각됩니다」",
    vocab: [
      V("私", "わたくし", "나"),
      V("二つ", "ふたつ", "두 가지"),
      V("全く", "まったく", "완전히"),
      V("性質", "せいしつ", "성질"),
      V("異にする", "ことにする", "달리하다"),
      V("思う", "おもう", "생각되다"),
    ],
    grammar: [
      { element: "性質を異にする", desc: "'성질을 달리하다'. 「異」를 동사적으로 써서 두 대상이 본질적으로 다름을 표현." },
      { element: "〜ように思われる", desc: "「思う」의 수동형. '~처럼 느껴진다, 생각된다'는 간접적·신중한 판단." },
    ],
    notes: [
      {
        title: "화자의 이중 유보",
        body: "「ように思われます」— '그렇게 느껴진다'에 수동형까지 쓰며 단정을 피한다. 자기 확신이 선생님의 단언 앞에서 흔들리기 시작한 기색.",
      },
    ],
    translations: {
      literal: "「제게는 그 두 가지가 완전히 성질을 달리하고 있는 것처럼 생각됩니다」",
      liberal: "「저로서는 그 둘이 전혀 다른 성질의 것이 아닌가 하는 생각이 듭니다」",
    },
  },
  {
    id: 525,
    paragraph: 13,
    original:
      "「いや同じです。私は男としてどうしてもあなたに満足を与えられない人間なのです。それから、ある特別の事情があって、なおさらあなたに満足を与えられないでいるのです。私は実際お気の毒に思っています。あなたが私からよそへ動いて行くのは仕方がない。私はむしろそれを希望しているのです。しかし……」",
    hiragana: [
      h("「いや ", false),
      h("おな", true), h("じです。 ", false),
      h("わたくし", true), h("は ", false),
      h("おとこ", true), h("としてどうしてもあなたに ", false),
      h("まんぞく", true), h("を ", false),
      h("あた", true), h("えられない ", false),
      h("にんげん", true), h("なのです。それから、ある ", false),
      h("とくべつ", true), h("の ", false),
      h("じじょう", true), h("があって、なおさらあなたに ", false),
      h("まんぞく", true), h("を ", false),
      h("あた", true), h("えられないでいるのです。 ", false),
      h("わたくし", true), h("は ", false),
      h("じっさい", true), h("お ", false),
      h("き", true), h("の ", false),
      h("どく", true), h("に ", false),
      h("おも", true), h("っています。あなたが ", false),
      h("わたくし", true), h("からよそへ ", false),
      h("うご", true), h("いて ", false),
      h("い", true), h("くのは ", false),
      h("しかた", true), h("がない。 ", false),
      h("わたくし", true), h("はむしろそれを ", false),
      h("きぼう", true), h("しているのです。しかし……」", false),
    ],
    meaning:
      "「아닙니다, 같은 것입니다. 나는 남자로서 아무리 해도 당신에게 만족을 줄 수 없는 인간입니다. 그리고 어떤 특별한 사정이 있어서, 한층 더 당신에게 만족을 주지 못하고 있는 것입니다. 나는 실제로 안쓰럽게 여기고 있습니다. 당신이 나에게서 다른 곳으로 움직여 가는 것은 어쩔 수 없습니다. 나는 오히려 그것을 바라고 있습니다. 그러나……」",
    vocab: [
      V("同じ", "おなじ", "같다"),
      V("私", "わたくし", "나"),
      V("男", "おとこ", "남자"),
      V("満足", "まんぞく", "만족"),
      V("与える", "あたえる", "주다"),
      V("人間", "にんげん", "인간"),
      V("特別", "とくべつ", "특별"),
      V("事情", "じじょう", "사정"),
      V("なおさら", "なおさら", "더더욱"),
      V("実際", "じっさい", "실제로"),
      V("お気の毒", "おきのどく", "안쓰러움"),
      V("思う", "おもう", "여기다, 생각하다"),
      V("よそ", "よそ", "다른 곳"),
      V("動く", "うごく", "움직이다"),
      V("行く", "いく", "가다"),
      V("仕方", "しかた", "어쩔 수 없음"),
      V("むしろ", "むしろ", "오히려"),
      V("希望", "きぼう", "희망, 바람"),
    ],
    grammar: [
      { element: "いや同じです", desc: "앞 문장 「異にしている」의 즉각 반박. '아니, 같다'고 단정." },
      {
        element: "男として〜人間",
        desc: "「として」 자격 조사. 「男として ~な人間」 = '남자로서 ~인 인간'. 남자라는 자격 자체에 결함이 있다고 자기를 규정.",
      },
      {
        element: "ある特別の事情があって",
        body: "",
        desc: "'어떤 특별한 사정이 있어서'. 구체를 밝히지 않고 존재만 알리는 수법 — 독자·화자 모두에게 궁금증을 남김.",
      },
      {
        element: "お気の毒に思う",
        desc: "'안쓰럽게 여기다'. 「お」경어 + 「気の毒」 감정명사 + 「に思う」. 상대를 향한 딱함을 경어체로 전달.",
      },
      {
        element: "むしろ〜希望している",
        desc: "'오히려 ~을 바라고 있다'. 자기를 떠나가는 것을 바라는 역설적 선언 — 13단락의 감정적 절정.",
      },
    ],
    notes: [
      {
        title: "선생님의 자기 규정",
        body: "'남자로서 당신을 만족시킬 수 없는 인간' — 선생님이 자기를 근본적 결핍체로 못박는 순간. 12단락 「私は淋しい人間です」의 심화형.",
      },
      {
        title: "「ある特別の事情」 — 서사의 복선",
        body: "여기서 처음 암시되는 '특별한 사정'이 『こころ』 후반의 「先生の遺書」에서 밝혀질 과거(K의 죽음, 배신)의 서사적 복선.",
      },
      {
        title: "「しかし……」로 끝나는 말줄임",
        body: "선생님이 「오히려 희망한다」 뒤에 즉시 「しかし……」로 말을 끊는다. 버리려는 마음과 놓고 싶지 않은 마음이 동시에 드러나는 소세키 특유의 이중 감정 표현.",
      },
    ],
    translations: {
      literal:
        "「아니, 같은 것이네. 나는 남자로서 아무리 해도 자네에게 만족을 줄 수 없는 인간이네. 게다가 어떤 특별한 사정이 있어서, 더더욱 자네에게 만족을 줄 수 없는 상태로 있다네. 나는 실제로 안쓰럽게 여기고 있네. 자네가 나에게서 다른 곳으로 움직여 가는 것은 어쩔 수 없지. 나는 오히려 그것을 바라고 있다네. 그러나……」",
      liberal:
        "「아닐세, 같은 것이야. 나는 남자로서 아무리 해도 자네에게 만족을 안겨 줄 수 없는 그런 인간이라네. 게다가 특별한 사정 한 가지가 있어, 자네에게 더욱더 만족을 건네지 못한 채로 지내고 있는 걸세. 나는 정말이지 자네에게 미안한 마음을 품고 있다네. 자네가 나를 떠나 다른 쪽으로 발길을 돌리는 것은 어쩔 수 없는 일이지. 아니, 나는 차라리 그리되기를 바라고 있네. 하지만……」",
    },
  },
  {
    id: 526,
    paragraph: 13,
    original: "私は変に悲しくなった。",
    hiragana: [
      h("わたくし", true), h("は ", false),
      h("へん", true), h("に ", false),
      h("かな", true), h("しくなった。", false),
    ],
    meaning: "나는 이상하게 슬퍼졌다.",
    vocab: [
      V("私", "わたくし", "나"),
      V("変", "へん", "이상한"),
      V("悲しい", "かなしい", "슬프다"),
    ],
    grammar: [
      { element: "変に〜なった", desc: "「変に」 부사 = '이상하게, 묘하게'. 자기로서도 설명되지 않는 감정의 변화." },
      { element: "悲しくなった", desc: "い형용사 + 「なる」. '~게 되었다'는 상태 변화. 의지 없이 찾아온 슬픔." },
    ],
    notes: [
      {
        title: "설명 없는 한 줄",
        body: "긴 525 뒤에 놓인 단 한 줄. 선생님의 '떠나 달라'는 말에 대한 화자의 즉각적·감정적 반응을, 논리적 해설 없이 신체 감각 같은 한 문장으로 기록한다.",
      },
    ],
    translations: {
      literal: "나는 이상하게 슬퍼졌다.",
      liberal: "나는 어쩐 일인지 까닭 모를 슬픔에 사로잡혀 버렸다.",
    },
  },
  {
    id: 527,
    paragraph: 13,
    original:
      "「私が先生から離れて行くようにお思いになれば仕方がありませんが、私にそんな気の起った事はまだありません」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("が ", false),
      h("せんせい", true), h("から ", false),
      h("はな", true), h("れて ", false),
      h("い", true), h("くようにお ", false),
      h("おも", true), h("いになれば ", false),
      h("しかた", true), h("がありませんが、 ", false),
      h("わたくし", true), h("にそんな ", false),
      h("き", true), h("の ", false),
      h("おこ", true), h("った ", false),
      h("こと", true), h("はまだありません」", false),
    ],
    meaning:
      "「제가 선생님에게서 떠나 가는 것처럼 생각하신다면 어쩔 수 없지만, 저에게 그런 마음이 일어난 적은 아직 없습니다」",
    vocab: [
      V("私", "わたくし", "나"),
      V("先生", "せんせい", "선생"),
      V("離れる", "はなれる", "떠나다"),
      V("行く", "いく", "가다"),
      V("思う", "おもう", "생각하다"),
      V("仕方", "しかた", "어쩔 수 없음"),
      V("気", "き", "마음, 기분"),
      V("起こる", "おこる", "일어나다"),
      V("事", "こと", "일"),
    ],
    grammar: [
      {
        element: "お思いになる",
        desc: "「思う」의 존경어. 「お〜になる」 존경 구문. 화자가 선생님에 대한 경어를 유지하며 반박하는 장면.",
      },
      {
        element: "〜ば仕方がありませんが",
        desc: "'~하신다면 어쩔 수 없지만'. 상대의 가정을 받아들인 뒤 「が」로 자기 입장을 세우는 수사적 양보 구문.",
      },
      { element: "気の起った事はまだありません", desc: "「気が起る」 = '마음이 일어나다'. 과거에 그런 마음이 든 적이 없다는 전면 부정." },
    ],
    notes: [
      {
        title: "선생님 앞에서도 지키는 경어",
        body: "반박하는 순간에도 「お思いになれば」라는 존경어를 쓴다. 화자가 선생님에게 품은 존경의 위계가 분노나 서운함보다 위에 있음을 드러낸다.",
      },
      {
        title: "화자의 확신 부인",
        body: "선생님이 '떠나 달라'고 한 말을 '제가 떠나려 한다고 보신 것'이라고 바꿔 받는다. 화자는 선생님의 해석을 받아들이지 못한다 — 그 거리감이 526의 슬픔을 낳는다.",
      },
    ],
    translations: {
      literal:
        "「제가 선생님에게서 떠나 가는 것처럼 생각하신다면 어쩔 수 없지만, 제게 그런 마음이 일어난 적은 아직 없습니다」",
      liberal:
        "「만약 선생님께서 제가 선생님 곁을 떠나려 한다고 여기신다면 그것까지는 어쩔 수 없겠지요. 하지만 저에게는 아직 그런 마음이 한 번도 일어난 적이 없습니다」",
    },
  },
  {
    id: 528,
    paragraph: 13,
    original: "先生は私の言葉に耳を貸さなかった。",
    hiragana: [
      h("せんせい", true), h("は ", false),
      h("わたくし", true), h("の ", false),
      h("ことば", true), h("に ", false),
      h("みみ", true), h("を ", false),
      h("か", true), h("さなかった。", false),
    ],
    meaning: "선생님은 내 말에 귀를 기울이지 않았다.",
    vocab: [
      V("先生", "せんせい", "선생"),
      V("私", "わたくし", "나"),
      V("言葉", "ことば", "말"),
      V("耳", "みみ", "귀"),
      V("貸す", "かす", "빌려주다"),
    ],
    grammar: [
      {
        element: "耳を貸す",
        desc: "관용구. '귀를 빌려주다 → 귀를 기울이다·남의 말을 듣다'. 부정형 「貸さなかった」로 '듣지 않았다'.",
      },
    ],
    notes: [
      {
        title: "단락의 중간 매듭",
        body: "화자가 반박을 쏟아 내도 선생님은 귀를 주지 않는다. 520~527의 주고받던 대화의 탁구가 여기서 끊기고, 이후 전개는 선생님의 독백적 연쇄로 이어질 것임을 예고.",
      },
      {
        title: "「耳を貸さない」의 정서",
        body: "싸늘함보다는 체념에 가까운 몸짓. 선생님이 화자의 부인을 '아직 몰라서 그런 것'이라 판단한 표지.",
      },
    ],
    translations: {
      literal: "선생은 나의 말에 귀를 빌려주지 않았다.",
      liberal: "선생님은 내 말에 도무지 귀를 기울이려 하지 않았다.",
    },
  },
];

for (const s of sentences) novel.push(s);

// ===== 4. Update paragraph map =====
const p13 = paraMap.paragraphs.find((p) => p.paragraph === 13);
if (p13) p13.range = [511, 528];
else paraMap.paragraphs.push({ paragraph: 13, range: [511, 528] });

// ===== Write =====
writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2) + "\n", "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2) + "\n", "utf8");
writeFileSync(novelParaPath, JSON.stringify(paraMap, null, 2) + "\n", "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocab[lv], null, 2) + "\n", "utf8");
}

console.log("Added paragraph 13 sentences 520-528.");
console.log("New kanji:", Object.keys(newKanji).join(", "));
console.log("New vocab indices:");
for (const [k, v] of Object.entries(idx)) console.log(`  ${k} -> ${v.level}#${v.index}`);
