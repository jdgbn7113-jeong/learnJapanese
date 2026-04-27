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

// ===== 1. Kanji =====
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
  "図": nk("図", ["ズ", "ト"], ["はか-る"], ["그림", "도면"], "N4", 2, 7,
    [["囗", "에워쌈", "outer"], ["ㄨ", "그려 넣은 모양", "inner"]],
    "囗(사방 테두리) 안에 그림을 그려 넣은 모양 — 도면, 그림.",
    "테두리 안의 그림 = 도면",
    [{ word: "地図", reading: "ちず", meaning: "지도" }, { word: "一図", reading: "いちず", meaning: "외곬" }]),
  "講": nk("講", ["コウ"], [], ["강의", "풀어 말하다"], "N3", 5, 17,
    [["言", "말", "left"], ["冓", "엮다·짜다", "right"]],
    "言(말)을 冓(엮어) 풀어 가르치는 것 = 강의.",
    "말을 엮어 가르침 = 강의",
    [{ word: "講義", reading: "こうぎ", meaning: "강의" }, { word: "講演", reading: "こうえん", meaning: "강연" }]),
  "益": nk("益", ["エキ", "ヤク"], ["ま-す"], ["이익", "더하다"], "N3", 5, 10,
    [["八", "나뉨", "top"], ["一", "한 줄", "middle"], ["皿", "그릇", "bottom"]],
    "皿(그릇)에 가득 차 八(밖으로 넘치는) 모습 — 차고 넘치는 이익.",
    "그릇에 넘치는 것 = 이익",
    [{ word: "有益", reading: "ゆうえき", meaning: "유익" }, { word: "利益", reading: "りえき", meaning: "이익" }]),
  "詰": nk("詰", ["キツ"], ["つ-める", "つ-まる"], ["막히다", "채우다"], "N2", 0, 13,
    [["言", "말", "left"], ["吉", "길·좋음·다짐", "right"]],
    "言(말)을 吉(다짐하듯) 꽉 채워 몰아붙임 — 막힘·채움.",
    "말로 몰아붙여 채움 = 詰",
    [{ word: "詰まる", reading: "つまる", meaning: "막히다" }, { word: "とどの詰まり", reading: "とどのつまり", meaning: "결국은" }]),
  "壇": nk("壇", ["ダン", "タン"], [], ["단", "연단"], "N1", 0, 16,
    [["土", "흙", "left"], ["亶", "돋워 쌓다·참됨", "right"]],
    "土(흙)을 亶(돋워 쌓아) 올린 자리 — 연단, 제단.",
    "쌓아 올린 자리 = 단",
    [{ word: "教壇", reading: "きょうだん", meaning: "교단" }, { word: "花壇", reading: "かだん", meaning: "화단" }]),
  "導": nk("導", ["ドウ"], ["みちび-く"], ["이끌다", "인도"], "N3", 5, 15,
    [["道", "길", "top"], ["寸", "손", "bottom"]],
    "道(길)을 寸(손)으로 가리켜 앞서 걷게 함 — 인도, 이끎.",
    "손으로 길을 가리킴 = 이끎",
    [{ word: "指導", reading: "しどう", meaning: "지도" }, { word: "導く", reading: "みちびく", meaning: "이끌다" }]),
  "偉": nk("偉", ["イ"], ["えら-い"], ["위대하다", "훌륭하다"], "N3", 0, 12,
    [["亻", "사람", "left"], ["韋", "가죽·둘러 감음", "right"]],
    "亻(사람)이 韋(가죽을 둘러 감은 듯) 남다르게 우뚝한 풍모를 지님 — 위대.",
    "가죽 두른 사람 = 위대",
    [{ word: "偉い", reading: "えらい", meaning: "훌륭하다" }, { word: "偉大", reading: "いだい", meaning: "위대" }]),
  "独": nk("独", ["ドク"], ["ひと-り"], ["홀로"], "N3", 5, 9,
    [["犭", "개(짐승)", "left"], ["虫", "벌레·작은 것", "right"]],
    "犭(짐승)이 무리 없이 홀로 다님 — 홀로.",
    "홀로 다니는 짐승 = 홀로",
    [{ word: "独り", reading: "ひとり", meaning: "홀로" }, { word: "独立", reading: "どくりつ", meaning: "독립" }]),
  "熱": nk("熱", ["ネツ"], ["あつ-い"], ["덥다", "열"], "N3", 4, 15,
    [["埶", "심다·기운", "top"], ["灬", "불", "bottom"]],
    "埶(땅에 심은 기운) + 灬(불) — 온몸을 덥히는 뜨거운 기운 = 열.",
    "심은 것에 피운 불 = 열",
    [{ word: "熱", reading: "ねつ", meaning: "열" }, { word: "熱い", reading: "あつい", meaning: "뜨겁다" }]),
  "厭": nk("厭", ["エン"], ["いや", "あ-きる"], ["싫다", "질리다"], "N1", 0, 14,
    [["厂", "벼랑", "outer"], ["猒", "배부름·질림", "inner"]],
    "厂(벼랑 아래 지붕) 밑에 猒(배불러 질림) — 더는 받아들이기 싫음 = 싫증.",
    "벼랑 아래 질림 = 싫음",
    [{ word: "厭", reading: "いや", meaning: "싫음" }, { word: "厭世", reading: "えんせい", meaning: "염세" }]),
  "化": nk("化", ["カ", "ケ"], ["ば-ける", "ば-かす"], ["변하다"], "N3", 3, 4,
    [["亻", "선 사람", "left"], ["匕", "뒤집힌 사람", "right"]],
    "亻(선 사람)이 匕(뒤집힌 사람)으로 바뀜 — 모습을 바꾸는 변화.",
    "사람이 뒤집힘 = 변화",
    [{ word: "変化", reading: "へんか", meaning: "변화" }, { word: "化石", reading: "かせき", meaning: "화석" }]),
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ===== 2. Vocab =====
const newVocab = {
  N5: [],
  N4: [
    { kana: "いけん", kanji: "意見", meaning: "의견", pos: "명사" },
    { kana: "へんか", kanji: "変化", meaning: "변화", pos: "명사·동사" },
    { kana: "うかぶ", kanji: "浮かぶ", meaning: "뜨다, 떠오르다", pos: "동사" },
    { kana: "まもる", kanji: "守る", meaning: "지키다", pos: "동사" },
    { kana: "さめる", kanji: "覚める", meaning: "깨어나다, 깨다", pos: "동사" },
    { kana: "それほど", kanji: "それほど", meaning: "그 정도로, 그다지", pos: "부사" },
    { kana: "あんまり", kanji: "あんまり", meaning: "별로, 그다지", pos: "부사" },
    { kana: "なお", kanji: "なお", meaning: "더욱, 여전히", pos: "부사" },
  ],
  N3: [
    { kana: "すくなくとも", kanji: "少なくとも", meaning: "적어도", pos: "부사" },
    { kana: "こうぎ", kanji: "講義", meaning: "강의", pos: "명사" },
    { kana: "きょうじゅ", kanji: "教授", meaning: "교수", pos: "명사" },
    { kana: "ありがたい", kanji: "有難い", meaning: "고맙다, 귀중하다", pos: "い형용사" },
    { kana: "しどう", kanji: "指導", meaning: "지도", pos: "명사·동사" },
    { kana: "ひとり", kanji: "独り", meaning: "홀로, 혼자", pos: "명사·부사" },
    { kana: "しんよう", kanji: "信用", meaning: "신용, 믿음", pos: "명사" },
    { kana: "よそう", kanji: "予想", meaning: "예상", pos: "명사·동사" },
    { kana: "じゅうぶん", kanji: "充分", meaning: "충분", pos: "な형용사·부사" },
    { kana: "えらい", kanji: "偉い", meaning: "훌륭하다, 위대하다", pos: "い형용사" },
    { kana: "ねつ", kanji: "熱", meaning: "열", pos: "명사" },
    { kana: "これからさき", kanji: "これから先", meaning: "앞으로", pos: "명사" },
    { kana: "ひとびと", kanji: "人々", meaning: "사람들", pos: "명사" },
  ],
  N2: [
    { kana: "ややともすると", kanji: "ややともすると", meaning: "자칫하면", pos: "부사" },
    { kana: "ゆうえき", kanji: "有益", meaning: "유익", pos: "な형용사" },
    { kana: "のぼせる", kanji: "逆上せる", meaning: "달아오르다, 흥분하다", pos: "동사" },
    { kana: "うかされる", kanji: "浮かされる", meaning: "들뜨다, 부림당하다", pos: "동사" },
    { kana: "けいはく", kanji: "軽薄", meaning: "경박", pos: "な형용사" },
    { kana: "ふしんよう", kanji: "不信用", meaning: "불신, 믿을 수 없음", pos: "명사·な형용사" },
    { kana: "いや", kanji: "厭", meaning: "싫음, 꺼림", pos: "な형용사" },
    { kana: "きょうだん", kanji: "教壇", meaning: "교단", pos: "명사" },
  ],
  N1: [
    { kana: "いちず", kanji: "一図", meaning: "외곬, 한 가지에만 몰두함", pos: "명사·な형용사" },
    { kana: "とどのつまり", kanji: "とどの詰まり", meaning: "결국은, 요컨대", pos: "부사" },
    { kana: "うけがう", kanji: "肯う", meaning: "수긍하다 (고어)", pos: "동사" },
  ],
};

const idx = {};
for (const [lv, items] of Object.entries(newVocab)) {
  const arr = vocab[lv].words;
  for (const item of items) {
    arr.push(item);
    idx[item.kanji] = { level: lv, index: arr.length - 1 };
  }
}

const ref = {
  "年": { level: "N5", index: 408 },
  "若い": { level: "N4", index: 72 },
  "私": { level: "N3", index: 43 },
  "先生": { level: "N5", index: 337 },
  "眼": { level: "N3", index: 52 },
  "映る": { level: "N5", index: 707 },
  "学校": { level: "N5", index: 162 },
  "談話": { level: "N2", index: 223 },
  "方": { level: "N5", index: 532 },
  "思想": { level: "N3", index: 326 },
  "立つ": { level: "N5", index: 358 },
  "多く": { level: "N4", index: 22 },
  "語る": { level: "N3", index: 203 },
  "見える": { level: "N5", index: 623 },
  "答える": { level: "N5", index: 236 },
  "時": { level: "N5", index: 403 },
  "自信": { level: "N3", index: 130 },
  "結果": { level: "N3", index: 238 },
  "思う": { level: "N5", index: 135 },
  "感じる": { level: "N4", index: 74 },
  "先": { level: "N5", index: 259 },
  "起こる": { level: "N4", index: 44 },
  "苦しい": { level: "N4", index: 175 },
  "あなた": { level: "N5", index: 23 },
  "今": { level: "N5", index: 68 },
  "お気の毒": { level: "N3", index: 359 },
  "おっしゃる": { level: "N4", index: 100 },
  "いう": { level: "N5", index: 41 },
};
Object.assign(ref, idx);

const V = (k, r, m, word) => ({
  kanji: k,
  reading: r,
  meaning: m,
  ...(ref[word ?? k] ? { ref: ref[word ?? k] } : {}),
});

// ===== 3. Sentences 538-548 =====
const h = (t, e = false) => ({ t, e });

const sentences = [
  {
    id: 538,
    paragraph: 14,
    original: "年の若い私わたくしはややともすると一図いちずになりやすかった。",
    hiragana: [
      h("とし", true), h("の ", false),
      h("わか", true), h("い ", false),
      h("わたくし", true), h("はややともすると ", false),
      h("いちず", true), h("になりやすかった。", false),
    ],
    meaning: "나이가 어렸던 나는 자칫하면 한 가지 생각에만 빠지기 쉬웠다.",
    vocab: [
      V("年", "とし", "나이"),
      V("若い", "わかい", "어리다"),
      V("私", "わたくし", "나"),
      V("ややともすると", "ややともすると", "자칫하면"),
      V("一図", "いちず", "외곬"),
    ],
    grammar: [
      { element: "ややともすると", desc: "'자칫하면, 걸핏하면'. 쉽게 한쪽으로 기우는 성향을 도입하는 부사." },
      { element: "一図になる", desc: "「一図」는 현대어 「一途(いちず)」의 옛 표기. '한 가지만 보고 달려드는 상태'가 되다." },
      { element: "〜やすい", desc: "'~하기 쉽다'. 화자가 스스로의 성향을 진단하는 장치." },
    ],
    notes: [
      {
        title: "14단락의 키워드 — '一図'",
        body: "13단락 529에서 선생님이 '조심해야 한다'고 경고한 바로 그 기질. 14단락은 이 경고 직후 화자의 성격을 소개하며 시작한다.",
      },
      {
        title: "「一図」 vs 「一途」",
        body: "소세키 시대 표기는 「一図」. 현대 일본어는 「一途」. 두 표기 모두 「いちず」로 동일하게 읽는다.",
      },
    ],
    translations: {
      literal: "나이가 어렸던 나는 자칫하면 한 가지 생각에만 빠지기 쉬웠다.",
      liberal: "아직 어렸던 나는, 걸핏하면 하나의 대상에만 외곬으로 몰입하는 기질이 있었다.",
    },
  },
  {
    id: 539,
    paragraph: 14,
    original: "少なくとも先生の眼にはそう映っていたらしい。",
    hiragana: [
      h("すく", true), h("なくとも ", false),
      h("せんせい", true), h("の ", false),
      h("め", true), h("にはそう ", false),
      h("うつ", true), h("っていたらしい。", false),
    ],
    meaning: "적어도 선생님의 눈에는 그렇게 비치고 있었던 모양이다.",
    vocab: [
      V("少なくとも", "すくなくとも", "적어도"),
      V("先生", "せんせい", "선생"),
      V("眼", "め", "눈"),
      V("映る", "うつる", "비치다"),
    ],
    grammar: [
      { element: "少なくとも", desc: "'적어도'. 한정·보류 부사. 다른 눈에는 어떻게 보였는지 모른다는 여운." },
      { element: "〜ていたらしい", desc: "「〜ていた」 지속 + 「らしい」 추량. '~하고 있었던 것 같다'. 타인 시점에 대한 추측." },
    ],
    notes: [
      {
        title: "자기 평가가 아닌 타자 시선",
        body: "538에서 자기 기질을 말한 뒤, 539에서 '선생님 눈에는 그렇게 보였다'로 관점을 넘긴다. 선생님의 평가가 이어지는 대화의 전제를 깐다.",
      },
    ],
    translations: {
      literal: "적어도 선생님의 눈에는 그렇게 비치고 있었던 것 같다.",
      liberal: "적어도 선생님의 눈에는 그렇게 비쳐 보였던 모양이다.",
    },
  },
  {
    id: 540,
    paragraph: 14,
    original: "私には学校の講義よりも先生の談話の方が有益なのであった。",
    hiragana: [
      h("わたくし", true), h("には ", false),
      h("がっこう", true), h("の ", false),
      h("こうぎ", true), h("よりも ", false),
      h("せんせい", true), h("の ", false),
      h("だんわ", true), h("の ", false),
      h("ほう", true), h("が ", false),
      h("ゆうえき", true), h("なのであった。", false),
    ],
    meaning: "나에게는 학교 강의보다 선생님의 이야기 쪽이 더 유익했다.",
    vocab: [
      V("私", "わたくし", "나"),
      V("学校", "がっこう", "학교"),
      V("講義", "こうぎ", "강의"),
      V("先生", "せんせい", "선생"),
      V("談話", "だんわ", "이야기, 담화"),
      V("方", "ほう", "쪽"),
      V("有益", "ゆうえき", "유익"),
    ],
    grammar: [
      { element: "AよりもBの方が〜", desc: "비교의 기본형. 'A보다 B쪽이 ~'. 선호·우열을 명확히 표현." },
      { element: "〜なのであった", desc: "문어적 단정 결어. '~이었던 것이다'. 판단의 여운을 길게 남김." },
    ],
    notes: [
      {
        title: "학교 vs 선생님",
        body: "대학생 화자가 제도 교육보다 선생님 한 사람의 사설 담화를 우위에 둔다. 근대 일본 지식인의 '사숙(私淑)' 전통의 문학적 재현.",
      },
    ],
    translations: {
      literal: "나에게는 학교의 강의보다 선생의 담화 쪽이 유익한 것이었다.",
      liberal: "나로서는 대학의 강의를 듣는 것보다 선생님과 나누는 대화 쪽이 훨씬 얻는 것이 많았다.",
    },
  },
  {
    id: 541,
    paragraph: 14,
    original: "教授の意見よりも先生の思想の方が有難いのであった。",
    hiragana: [
      h("きょうじゅ", true), h("の ", false),
      h("いけん", true), h("よりも ", false),
      h("せんせい", true), h("の ", false),
      h("しそう", true), h("の ", false),
      h("ほう", true), h("が ", false),
      h("ありがた", true), h("いのであった。", false),
    ],
    meaning: "교수의 의견보다 선생님의 사상 쪽이 더 귀하게 느껴졌다.",
    vocab: [
      V("教授", "きょうじゅ", "교수"),
      V("意見", "いけん", "의견"),
      V("先生", "せんせい", "선생"),
      V("思想", "しそう", "사상"),
      V("方", "ほう", "쪽"),
      V("有難い", "ありがたい", "귀중하다, 고맙다"),
    ],
    grammar: [
      { element: "AよりもBの方が有難い", desc: "540과 동일 구조의 병렬. '의견 < 사상', '강의 < 담화'의 대조를 리듬으로 각인." },
      { element: "有難い", desc: "'귀중하다·고맙다'. 단순 '감사'가 아니라 '좀처럼 얻기 어려운 것'이라는 어원적 뉘앙스." },
    ],
    notes: [
      {
        title: "명사 쌍의 층위",
        body: "学校 < 先生, 講義 < 談話, 教授 < 先生, 意見 < 思想. 공식·집단 < 개인·깊이의 대조가 네 차례 겹치며, 화자에게 선생님이 가진 위상을 점층적으로 높인다.",
      },
    ],
    translations: {
      literal: "교수의 의견보다 선생의 사상 쪽이 귀중한 것이었다.",
      liberal: "교수의 견해보다도 선생님의 사상 쪽이 훨씬 값지게 여겨지곤 했다.",
    },
  },
  {
    id: 542,
    paragraph: 14,
    original:
      "とどの詰まりをいえば、教壇に立って私を指導してくれる偉い人々よりもただ独ひとりを守って多くを語らない先生の方が偉く見えたのであった。",
    hiragana: [
      h("とどのつまり", true), h("をいえば、 ", false),
      h("きょうだん", true), h("に ", false),
      h("た", true), h("って ", false),
      h("わたくし", true), h("を ", false),
      h("しどう", true), h("してくれる ", false),
      h("えら", true), h("い ", false),
      h("ひとびと", true), h("よりもただ ", false),
      h("ひと", true), h("りを ", false),
      h("まも", true), h("って ", false),
      h("おお", true), h("くを ", false),
      h("かた", true), h("らない ", false),
      h("せんせい", true), h("の ", false),
      h("ほう", true), h("が ", false),
      h("えら", true), h("く ", false),
      h("み", true), h("えたのであった。", false),
    ],
    meaning:
      "결국 요컨대, 교단에 서서 나를 지도해 주는 훌륭한 사람들보다, 그저 홀로를 지키고 많이 말하지 않는 선생님 쪽이 더 훌륭해 보이는 것이었다.",
    vocab: [
      V("とどの詰まり", "とどのつまり", "결국은"),
      V("いう", "いう", "말하다"),
      V("教壇", "きょうだん", "교단"),
      V("立つ", "たつ", "서다"),
      V("私", "わたくし", "나"),
      V("指導", "しどう", "지도"),
      V("偉い", "えらい", "훌륭하다"),
      V("人々", "ひとびと", "사람들"),
      V("独り", "ひとり", "홀로"),
      V("守る", "まもる", "지키다"),
      V("多く", "おおく", "많이"),
      V("語る", "かたる", "말하다"),
      V("先生", "せんせい", "선생"),
      V("方", "ほう", "쪽"),
      V("見える", "みえる", "보이다"),
    ],
    grammar: [
      { element: "とどの詰まり", desc: "'요컨대, 결국은'. 긴 비교를 한 줄로 요약하며 결론을 내리는 관용 부사." },
      {
        element: "〜してくれるA よりも 〜ないBの方が",
        desc: "두 대상을 각각 긴 관계절로 수식해 대비. '적극적으로 가르치는 사람들' vs '침묵하며 홀로를 지키는 한 사람'.",
      },
      { element: "独りを守る", desc: "「独り」를 목적어로 써서 '고독을 지킨다'는 동작을 명사화. 선생님의 생활 자세를 한 구절에 응축." },
    ],
    notes: [
      {
        title: "'훌륭함'의 재정의",
        body: "「偉い人々」와 「偉く見えた」에서 「偉」가 두 번 쓰인다. 제도적 권위의 '훌륭함'을 침묵과 고독의 '훌륭함'으로 뒤집는 전환점.",
      },
      {
        title: "소세키의 지식인 상",
        body: "메이지 말 관학(官学) 교수들에 대한 간접 비판. 공적 권위보다 내면의 깊이를 지닌 개인을 우위에 두는 소세키의 일관된 태도.",
      },
    ],
    translations: {
      literal:
        "요컨대, 교단에 서서 나를 지도해 주는 훌륭한 사람들보다 그저 홀로를 지키고 많이 말하지 않는 선생 쪽이 더 훌륭해 보였던 것이다.",
      liberal:
        "한마디로 줄여 말한다면, 교단에 서서 나를 가르쳐 주시는 그 이름난 분들보다, 오히려 고독을 지키며 좀처럼 말을 아끼는 선생님 쪽이 훨씬 위대해 보였던 것이다.",
    },
  },
  {
    id: 543,
    paragraph: 14,
    original: "「あんまり逆上のぼせちゃいけません」と先生がいった。",
    hiragana: [
      h("「あんまり ", false),
      h("のぼ", true), h("せちゃいけません」と ", false),
      h("せんせい", true), h("がいった。", false),
    ],
    meaning: "「너무 들뜨면 안 됩니다」라고 선생님이 말했다.",
    vocab: [
      V("あんまり", "あんまり", "너무, 별로"),
      V("逆上せる", "のぼせる", "달아오르다, 흥분하다"),
      V("先生", "せんせい", "선생"),
      V("いう", "いう", "말하다"),
    ],
    grammar: [
      {
        element: "逆上(のぼ)せる",
        desc: "「逆上」을 훈독 「のぼせる」로 읽는 숙자훈. '기가 거꾸로 위로 올라 들뜨다, 흥분하다'. 피가 머리로 치솟는 감각을 보존한 표기.",
      },
      { element: "〜ちゃいけません", desc: "「〜てはいけません」의 구어 축약. 경고·금지의 톤." },
    ],
    notes: [
      {
        title: "선생님의 간결한 제지",
        body: "538~542의 긴 찬양 뒤에 한 줄로 끊어 들어오는 선생님의 말. '逆上せる'라는 강한 단어로 화자의 심취를 병적 과열로 규정한다.",
      },
    ],
    translations: {
      literal: "「너무 들뜨면 안 되네」라고 선생이 말했다.",
      liberal: "「너무 그렇게 들뜨면 못쓰네」 하고 선생님이 말씀하셨다.",
    },
  },
  {
    id: 544,
    paragraph: 14,
    original:
      "「覚さめた結果としてそう思うんです」と答えた時の私には充分の自信があった。その自信を先生は肯うけがってくれなかった。",
    hiragana: [
      h("「 ", false),
      h("さ", true), h("めた ", false),
      h("けっか", true), h("としてそう ", false),
      h("おも", true), h("うんです」と ", false),
      h("こた", true), h("えた ", false),
      h("とき", true), h("の ", false),
      h("わたくし", true), h("には ", false),
      h("じゅうぶん", true), h("の ", false),
      h("じしん", true), h("があった。その ", false),
      h("じしん", true), h("を ", false),
      h("せんせい", true), h("は ", false),
      h("うけが", true), h("ってくれなかった。", false),
    ],
    meaning:
      "「깨어난 결과로서 그렇게 생각하는 것입니다」라고 답했을 때의 나에게는 충분한 자신이 있었다. 그 자신감을 선생님은 수긍해 주지 않았다.",
    vocab: [
      V("覚める", "さめる", "깨어나다"),
      V("結果", "けっか", "결과"),
      V("思う", "おもう", "생각하다"),
      V("答える", "こたえる", "답하다"),
      V("時", "とき", "때"),
      V("私", "わたくし", "나"),
      V("充分", "じゅうぶん", "충분"),
      V("自信", "じしん", "자신"),
      V("先生", "せんせい", "선생"),
      V("肯う", "うけがう", "수긍하다"),
    ],
    grammar: [
      { element: "覚めた結果として", desc: "'깨어난 결과로서'. 열에 들뜬 게 아니라 냉정해진 뒤의 판단이라는 화자의 반박 논리." },
      {
        element: "肯(うけが)う",
        desc: "'수긍하다, 받아들이다'의 고어. 현대어 「肯(うなず)く」의 문어적 표기. 소세키 특유의 한자·훈 결합.",
      },
      { element: "〜てくれなかった", desc: "'~해 주지 않았다'. 기대·호의가 거절된 상황을 드러내는 수여 동사 부정." },
    ],
    notes: [
      {
        title: "두 자신의 대치",
        body: "화자는 '충분한 자신'을 가지고 답했고, 선생님은 그 '자신'을 수긍하지 않았다. 같은 단어를 두 번 반복해 충돌을 시각적으로 표시.",
      },
      {
        title: "「肯う」의 선택",
        body: "평범한 「うなずく」대신 고어 「肯う」. 무게 있고 엄숙한 거부 — 단순히 고개를 젓지 않은 것이 아니라 '그 자신을 받아들이지 않았다'는 판단.",
      },
    ],
    translations: {
      literal:
        "「깨어난 결과로서 그렇게 생각하는 것입니다」라고 답했을 때의 나에게는 충분한 자신이 있었다. 그 자신을 선생은 수긍해 주지 않았다.",
      liberal:
        "「제가 정신을 차린 결과 그렇게 생각하고 있는 것입니다」 하고 답하던 그 순간, 내게는 그만큼의 분명한 확신이 있었다. 그러나 선생님은 그 확신을 끝내 받아들여 주지 않으셨다.",
    },
  },
  {
    id: 545,
    paragraph: 14,
    original:
      "「あなたは熱に浮かされているのです。熱がさめると厭いやになります。私は今のあなたからそれほどに思われるのを、苦しく感じています。しかしこれから先のあなたに起るべき変化を予想して見ると、なお苦しくなります」",
    hiragana: [
      h("「あなたは ", false),
      h("ねつ", true), h("に ", false),
      h("う", true), h("かされているのです。 ", false),
      h("ねつ", true), h("がさめると ", false),
      h("いや", true), h("になります。 ", false),
      h("わたくし", true), h("は ", false),
      h("いま", true), h("のあなたからそれほどに ", false),
      h("おも", true), h("われるのを、 ", false),
      h("くる", true), h("しく ", false),
      h("かん", true), h("じています。しかしこれから ", false),
      h("さき", true), h("のあなたに ", false),
      h("おこ", true), h("るべき ", false),
      h("へんか", true), h("を ", false),
      h("よそう", true), h("して ", false),
      h("み", true), h("ると、なお ", false),
      h("くる", true), h("しくなります」", false),
    ],
    meaning:
      "「자네는 열에 들떠 있는 것이네. 열이 식으면 싫어지게 됩니다. 나는 지금의 자네로부터 그 정도로 여겨지는 것을 괴롭게 느끼고 있네. 그러나 앞으로의 자네에게 일어날 변화를 예상해 보면, 더욱 괴로워지네」",
    vocab: [
      V("あなた", "あなた", "자네, 당신"),
      V("熱", "ねつ", "열"),
      V("浮かされる", "うかされる", "들뜨다"),
      V("覚める", "さめる", "식다, 깨다"),
      V("厭", "いや", "싫음"),
      V("私", "わたくし", "나"),
      V("今", "いま", "지금"),
      V("それほど", "それほど", "그 정도로"),
      V("思う", "おもう", "생각하다"),
      V("苦しい", "くるしい", "괴롭다"),
      V("感じる", "かんじる", "느끼다"),
      V("先", "さき", "앞, 이후"),
      V("起こる", "おこる", "일어나다"),
      V("変化", "へんか", "변화"),
      V("予想", "よそう", "예상"),
      V("見える", "みる", "보다"),
      V("なお", "なお", "더욱"),
    ],
    grammar: [
      {
        element: "熱に浮かされる",
        desc: "관용구. '열에 들뜨다, 제정신을 잃다'. 실제 고열 환자의 섬망에서 비유적으로 확장된 표현. 화자의 심취를 병증으로 규정.",
      },
      { element: "〜と厭になります", desc: "「〜と」 확정 조건. '~하면 반드시 ~하게 된다'. 선생님이 화자의 미래를 단정적으로 예언." },
      {
        element: "〜に起るべき変化",
        desc: "「〜べき」 당연·예정. '일어나기 마련인 변화'. 회피할 수 없는 필연으로 격하.",
      },
      { element: "予想して見る", desc: "「〜てみる」 시도. '예상해 보다'. 현재 괴로움 + 미래 예상의 이중 괴로움." },
    ],
    notes: [
      {
        title: "두 겹의 괴로움",
        body: "① 지금 화자에게 그만큼 존경받는 것이 괴롭다 / ② 그 존경이 곧 식을 것을 예상하면 더 괴롭다. 선생님 자신이 '화자의 열정'의 수명을 알고 있다는 슬픔.",
      },
      {
        title: "병 = 사랑 = 존경",
        body: "13단락의 '사랑 = 열병' 구도가 14단락에서는 '존경 = 열병'으로 확장. 선생님은 모든 강한 감정을 일시적 열로 본다.",
      },
    ],
    translations: {
      literal:
        "「자네는 열에 들떠 있는 것이네. 열이 식으면 싫어지게 되지. 나는 지금의 자네로부터 그 정도로 여겨지는 것을 괴롭게 느끼고 있네. 그러나 앞으로의 자네에게 일어날 변화를 예상해 보면, 더욱 괴로워지네」",
      liberal:
        "「자네는 지금 한차례 열병에 들떠 있는 것이네. 그 열이 식고 나면 이내 싫증을 내게 되고 말 걸세. 지금의 자네에게 그토록 높이 받들어지는 것이 나로서는 괴로울 지경이야. 하지만 앞으로 자네에게 찾아올 그 변화를 미리 그려 볼라치면, 괴로움이 한층 더 깊어지네」",
    },
  },
  {
    id: 546,
    paragraph: 14,
    original: "「私はそれほど軽薄に思われているんですか。それほど不信用なんですか」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("はそれほど ", false),
      h("けいはく", true), h("に ", false),
      h("おも", true), h("われているんですか。それほど ", false),
      h("ふしんよう", true), h("なんですか」", false),
    ],
    meaning: "「저는 그 정도로 경박하게 여겨지는 것입니까. 그 정도로 믿을 수 없는 것입니까」",
    vocab: [
      V("私", "わたくし", "나"),
      V("それほど", "それほど", "그 정도로"),
      V("軽薄", "けいはく", "경박"),
      V("思う", "おもう", "생각되다"),
      V("不信用", "ふしんよう", "불신"),
    ],
    grammar: [
      { element: "〜に思われている", desc: "수동. '~하게 여겨지고 있다'. 타자 시선에 자기를 맡긴 물음." },
      { element: "それほど〜なんですか", desc: "두 번의 반복으로 항변을 강화. 짧은 두 문장이 연속 타격처럼 이어짐." },
    ],
    notes: [
      {
        title: "화자의 반발",
        body: "선생님의 '열병' 진단에 대해 처음으로 감정적 반발이 나오는 순간. 「軽薄」(경박)과 「不信用」(믿을 수 없음) 두 낱말이 서로를 증폭.",
      },
    ],
    translations: {
      literal: "「저는 그 정도로 경박하게 여겨지고 있는 것입니까. 그 정도로 믿을 수 없는 것입니까」",
      liberal: "「저란 사람이 그토록 경박하게 비치고 있단 말씀입니까. 그만큼 제가 믿을 만하지 못하다는 말씀인가요」",
    },
  },
  {
    id: 547,
    paragraph: 14,
    original: "「私はお気の毒に思うのです」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("はお ", false),
      h("き", true), h("の ", false),
      h("どく", true), h("に ", false),
      h("おも", true), h("うのです」", false),
    ],
    meaning: "「나는 안쓰럽게 여기는 것입니다」",
    vocab: [
      V("私", "わたくし", "나"),
      V("お気の毒", "おきのどく", "안쓰러움"),
      V("思う", "おもう", "여기다"),
    ],
    grammar: [
      { element: "お気の毒に思う", desc: "'딱하게·안쓰럽게 여기다'. 경멸이 아니라 연민이 감정의 중심임을 다시 확인." },
    ],
    notes: [
      {
        title: "짧은 정정",
        body: "546의 두 가지 항변('경박'/'불신용')에 대해 선생님은 둘 다 아니라며 '연민'이라는 제3의 답을 내민다. 545의 '苦しく感じています'와 일관된 감정."
      },
    ],
    translations: {
      literal: "「나는 안쓰럽게 여기는 것이라네」",
      liberal: "「나는 자네가 안쓰러워 그러는 것일세」",
    },
  },
  {
    id: 548,
    paragraph: 14,
    original: "「気の毒だが信用されないとおっしゃるんですか」",
    hiragana: [
      h("「 ", false),
      h("き", true), h("の ", false),
      h("どく", true), h("だが ", false),
      h("しんよう", true), h("されないとおっしゃるんですか」", false),
    ],
    meaning: "「안쓰럽기는 하지만 믿어지지는 않는다고 말씀하시는 것입니까」",
    vocab: [
      V("お気の毒", "きのどく", "딱함, 안쓰러움"),
      V("信用", "しんよう", "신용"),
      V("おっしゃる", "おっしゃる", "말씀하시다"),
    ],
    grammar: [
      {
        element: "気の毒だが信用されない",
        desc: "「〜だが〜ない」 역접 병렬. 선생님의 '연민'을 '결국 믿지 않는 것'으로 되받아치는 화자의 논리적 반박.",
      },
      { element: "〜とおっしゃるんですか", desc: "「と言う」의 존경 + 확인 물음. 선생님의 말을 재해석해 되묻는 수사적 장치." },
    ],
    notes: [
      {
        title: "14단락의 첫 교착",
        body: "선생님의 '안쓰러움' + 화자의 '불신용 아니냐'는 반격. 감정(연민)과 판단(신용)을 분리하려는 선생님 vs 그 둘을 같이 묶어 버리는 화자. 다음 전개의 긴장이 여기서 세팅된다.",
      },
    ],
    translations: {
      literal: "「안쓰럽기는 하지만 믿어지지는 않는다고 말씀하시는 것입니까」",
      liberal: "「저를 안쓰럽게 보신다지만, 결국은 믿지 못하시겠다는 말씀이신 것 아닙니까」",
    },
  },
];

for (const s of sentences) novel.push(s);

// ===== 4. Paragraph map =====
const p14 = paraMap.paragraphs.find((p) => p.paragraph === 14);
if (p14) p14.range = [538, 548];
else paraMap.paragraphs.push({ paragraph: 14, range: [538, 548] });

// ===== Write =====
writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2) + "\n", "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2) + "\n", "utf8");
writeFileSync(novelParaPath, JSON.stringify(paraMap, null, 2) + "\n", "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocab[lv], null, 2) + "\n", "utf8");
}

console.log("Added paragraph 14 sentences 538-548.");
console.log("New kanji:", Object.keys(newKanji).join(", "));
console.log("New vocab indices:");
for (const [k, v] of Object.entries(idx)) console.log(`  ${k} -> ${v.level}#${v.index}`);
