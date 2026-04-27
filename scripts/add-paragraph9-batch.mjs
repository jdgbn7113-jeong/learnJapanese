import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "public", "data");
const novelDir = join(__dirname, "..", "novel");

const kanjiPath = join(dataDir, "kanji.json");
const novelPath = join(dataDir, "novel.json");
const novelParaPub = join(dataDir, "novel-paragraphs.json");
const novelParaSrc = join(novelDir, "paragraph-map.json");

const vocabPath = (lv) => join(dataDir, `vocab-${lv.toLowerCase()}.json`);

const kanji = JSON.parse(readFileSync(kanjiPath, "utf8"));
const novel = JSON.parse(readFileSync(novelPath, "utf8"));
const paraMap = JSON.parse(readFileSync(novelParaSrc, "utf8"));

const vocabFiles = {};
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  vocabFiles[lv] = JSON.parse(readFileSync(vocabPath(lv), "utf8"));
}

// ============ NEW KANJI ENTRIES ============
const newKanji = {
  "及": {
    char: "及", readings: { onyomi: ["キュウ"], kunyomi: ["およ.ぶ", "およ.び", "およ.ぼす"] },
    meanings: ["미치다", "이르다", "및"], jlpt: "N2", grade: 8, strokes: 3,
    radicals: [{ char: "丿", meaning: "삐침", position: "left" }, { char: "又", meaning: "오른손", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "丿", persona: "달아나는 사람의 등" }, { char: "又", persona: "뻗은 손" }],
      story: "달아나는 사람(丿)을 뒤에서 손(又)을 뻗어 잡는 순간 — 그 손이 등에 '미치다, 이르다'.",
      keyImage: "손이 등에 닿는 순간 = 미치다",
    },
    examples: [
      { word: "及ぶ", reading: "およぶ", meaning: "미치다, 이르다" },
      { word: "普及", reading: "ふきゅう", meaning: "보급" },
    ],
  },
  "咽": {
    char: "咽", readings: { onyomi: ["イン", "エン"], kunyomi: ["のど", "むせ.ぶ"] },
    meanings: ["목구멍"], jlpt: "N1", grade: 8, strokes: 9,
    radicals: [{ char: "口", meaning: "입", position: "left" }, { char: "因", meaning: "원인", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "口", persona: "입" }, { char: "因", persona: "안으로 들어오는 원인" }],
      story: "口(입)으로 因(들어오는 것)이 통과하는 좁은 길 → 목구멍.",
      keyImage: "입의 안쪽 통로 = 목구멍",
    },
    examples: [{ word: "咽喉", reading: "いんこう", meaning: "인후, 목구멍" }],
  },
  "喉": {
    char: "喉", readings: { onyomi: ["コウ"], kunyomi: ["のど"] },
    meanings: ["목", "목구멍"], jlpt: "N1", grade: 8, strokes: 12,
    radicals: [{ char: "口", meaning: "입", position: "left" }, { char: "侯", meaning: "제후", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "口", persona: "입" }, { char: "侯", persona: "귀한 통로" }],
      story: "口(입) 안에 자리한 侯(귀한 길) — 음식과 숨이 지나가는 좁은 통로 = 목.",
      keyImage: "입 안의 좁은 길 = 목",
    },
    examples: [
      { word: "喉", reading: "のど", meaning: "목" },
      { word: "咽喉", reading: "いんこう", meaning: "인후" },
    ],
  },
  "喧": {
    char: "喧", readings: { onyomi: ["ケン"], kunyomi: ["やかま.しい", "かまびす.しい"] },
    meanings: ["시끄럽다", "떠들썩하다"], jlpt: "N1", grade: 9, strokes: 12,
    radicals: [{ char: "口", meaning: "입", position: "left" }, { char: "宣", meaning: "선언하다", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "口", persona: "외치는 입" }, { char: "宣", persona: "큰 소리의 선언" }],
      story: "口(입)으로 宣(선언)을 외치는 큰 소리 → 시끄럽다, 떠들썩하다.",
      keyImage: "큰 소리로 외침 = 시끄러움",
    },
    examples: [{ word: "喧嘩", reading: "けんか", meaning: "싸움, 다툼" }],
  },
  "嘩": {
    char: "嘩", readings: { onyomi: ["カ"], kunyomi: ["かまびす.しい"] },
    meanings: ["떠들썩하다"], jlpt: "N1", grade: 9, strokes: 13,
    radicals: [{ char: "口", meaning: "입", position: "left" }, { char: "華", meaning: "화려함", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "口", persona: "입" }, { char: "華", persona: "화려하게 모인 잔치" }],
      story: "口(입)들이 華(화려)하게 모인 자리 — 떠들썩한 잔치, 시끄러움.",
      keyImage: "화려한 입들의 합창",
    },
    examples: [{ word: "喧嘩", reading: "けんか", meaning: "싸움, 다툼" }],
  },
  "奮": {
    char: "奮", readings: { onyomi: ["フン"], kunyomi: ["ふる.う"] },
    meanings: ["떨치다", "분발하다"], jlpt: "N2", grade: 6, strokes: 16,
    radicals: [
      { char: "大", meaning: "큰", position: "top" },
      { char: "隹", meaning: "새", position: "middle" },
      { char: "田", meaning: "밭", position: "bottom" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "大", persona: "큰 기세" },
        { char: "隹", persona: "날아오르는 새" },
        { char: "田", persona: "박차고 떠난 밭" },
      ],
      story: "大(큰) 새(隹)가 田(밭)을 박차고 날개를 떨치며 솟구친다 — 분발하다.",
      keyImage: "밭을 박차고 날아오르는 새",
    },
    examples: [
      { word: "興奮", reading: "こうふん", meaning: "흥분" },
      { word: "奮闘", reading: "ふんとう", meaning: "분투" },
    ],
  },
  "懸": {
    char: "懸", readings: { onyomi: ["ケン", "ケ"], kunyomi: ["か.ける", "か.かる"] },
    meanings: ["걸다", "매달다"], jlpt: "N1", grade: 8, strokes: 20,
    radicals: [
      { char: "県", meaning: "매단 머리", position: "top" },
      { char: "心", meaning: "마음", position: "bottom" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "県", persona: "매달려 있는 것" },
        { char: "心", persona: "함께 매달린 마음" },
      ],
      story: "県(매달린 것) 아래 心(마음)이 함께 매달려 있다 — 걸다, 마음에 걸리다.",
      keyImage: "매달린 마음 = 걸다",
    },
    examples: [
      { word: "懸ける", reading: "かける", meaning: "걸다" },
      { word: "懸念", reading: "けねん", meaning: "염려, 우려" },
    ],
  },
  "承": {
    char: "承", readings: { onyomi: ["ショウ"], kunyomi: ["うけたまわ.る", "う.ける"] },
    meanings: ["받들다", "잇다", "승낙하다"], jlpt: "N2", grade: 5, strokes: 8,
    radicals: [{ char: "手", meaning: "양손", position: "all" }],
    mnemonic: {
      radicalRoles: [{ char: "手", persona: "두 손으로 받쳐 든 모양" }],
      story: "양손을 위로 들어 무언가를 받쳐 잇는 모양 — 받들다, 이어받다, 승낙하다.",
      keyImage: "두 손으로 받쳐 잇다",
    },
    examples: [
      { word: "承知", reading: "しょうち", meaning: "승낙, 받아들임" },
      { word: "承る", reading: "うけたまわる", meaning: "받들다" },
    ],
  },
  "昂": {
    char: "昂", readings: { onyomi: ["コウ", "ゴウ"], kunyomi: ["あ.がる", "たか.ぶる"] },
    meanings: ["높이다", "흥분하다"], jlpt: "N1", grade: 9, strokes: 8,
    radicals: [
      { char: "日", meaning: "해", position: "top" },
      { char: "卬", meaning: "우러르다", position: "bottom" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "日", persona: "솟는 해" },
        { char: "卬", persona: "우러르는 자세" },
      ],
      story: "日(해)을 卬(우러르며) 솟구치는 기세 — 높이다, 기분이 들뜨다, 흥분하다.",
      keyImage: "해를 향해 솟구치는 기세",
    },
    examples: [{ word: "昂奮", reading: "こうふん", meaning: "흥분 (興奮의 옛 표기)" }],
  },
  "肴": {
    char: "肴", readings: { onyomi: ["コウ"], kunyomi: ["さかな"] },
    meanings: ["안주"], jlpt: "N1", grade: 9, strokes: 8,
    radicals: [
      { char: "爻", meaning: "엇갈린 막대", position: "top" },
      { char: "月", meaning: "고기", position: "bottom" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "爻", persona: "엇갈리게 썬 모양" },
        { char: "月", persona: "고기·생선" },
      ],
      story: "肉(月)을 爻(엇갈리게) 썰어 술상에 올린 — 안주. 단순한 '생선(魚)'이 아니라 술자리의 풍경을 담은 글자.",
      keyImage: "술상의 고기 한 점 = 안주",
    },
    examples: [{ word: "肴", reading: "さかな", meaning: "안주" }],
  },
  "誤": {
    char: "誤", readings: { onyomi: ["ゴ"], kunyomi: ["あやま.る"] },
    meanings: ["잘못하다", "오해"], jlpt: "N3", grade: 6, strokes: 14,
    radicals: [
      { char: "言", meaning: "말", position: "left" },
      { char: "呉", meaning: "비뚤어진 입", position: "right" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "言", persona: "말" },
        { char: "呉", persona: "비뚤어지게 떠드는 입" },
      ],
      story: "言(말)이 呉(비뚤어지게) 나오면 — 잘못, 오해.",
      keyImage: "비뚤어진 말 = 잘못",
    },
    examples: [
      { word: "誤解", reading: "ごかい", meaning: "오해" },
      { word: "誤る", reading: "あやまる", meaning: "잘못하다" },
    ],
  },
  "題": {
    char: "題", readings: { onyomi: ["ダイ"], kunyomi: [] },
    meanings: ["제목", "문제"], jlpt: "N4", grade: 3, strokes: 18,
    radicals: [
      { char: "是", meaning: "옳음", position: "left" },
      { char: "頁", meaning: "머리", position: "right" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "是", persona: "옳게 자리잡은 표지" },
        { char: "頁", persona: "머리·앞머리" },
      ],
      story: "頁(머리·앞머리)에 是(옳게) 붙는 글자 — 제목, 문제.",
      keyImage: "머리에 붙는 표지 = 제목",
    },
    examples: [
      { word: "問題", reading: "もんだい", meaning: "문제" },
      { word: "題名", reading: "だいめい", meaning: "제목" },
    ],
  },
  "骨": {
    char: "骨", readings: { onyomi: ["コツ"], kunyomi: ["ほね"] },
    meanings: ["뼈"], jlpt: "N3", grade: 6, strokes: 10,
    radicals: [
      { char: "冎", meaning: "뼈 모양", position: "top" },
      { char: "月", meaning: "살(고기)", position: "bottom" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "冎", persona: "뼈의 모양" },
        { char: "月", persona: "살" },
      ],
      story: "冎(뼈 모양) 아래 月(살) — 살 안에서 몸을 받치는 뼈.",
      keyImage: "살을 받치는 뼈",
    },
    examples: [
      { word: "骨", reading: "ほね", meaning: "뼈" },
      { word: "骨折", reading: "こっせつ", meaning: "골절" },
    ],
  },
};

for (const [ch, entry] of Object.entries(newKanji)) {
  if (!kanji[ch]) kanji[ch] = entry;
}

// ============ NEW VOCAB ENTRIES (per level, appended) ============
const newVocab = {
  N5: [
    { kana: "わかる", kanji: "分る", meaning: "알다, 이해하다 (分かる의 옛 표기)", pos: "동사" },
    { kana: "こたえ", kanji: "答え", meaning: "대답, 답", pos: "명사" },
  ],
  N4: [
    { kana: "じつは", kanji: "実は", meaning: "실은, 사실은", pos: "부사" },
    { kana: "けんか", kanji: "喧嘩", meaning: "싸움, 다툼", pos: "명사" },
  ],
  N3: [
    { kana: "ひっかかる", kanji: "引っ懸かる", meaning: "걸리다, 마음에 걸리다", pos: "동사" },
    { kana: "ほね", kanji: "骨", meaning: "뼈", pos: "명사" },
    { kana: "ささる", kanji: "刺さる", meaning: "박히다, 꽂히다", pos: "동사" },
    { kana: "よい", kanji: "好い", meaning: "좋다 (良い·いい의 격식 표기)", pos: "い형용사" },
    { kana: "いいだす", kanji: "言い出す", meaning: "말을 꺼내다", pos: "동사" },
    { kana: "しんけい", kanji: "神経", meaning: "신경", pos: "명사" },
    { kana: "ごかい", kanji: "誤解", meaning: "오해", pos: "명사·する동사" },
    { kana: "きかせる", kanji: "聞かせる", meaning: "들려주다, 일러 주다", pos: "동사" },
    { kana: "しょうち", kanji: "承知", meaning: "승낙, 받아들임", pos: "명사·する동사" },
  ],
  N2: [
    { kana: "おもいなおす", kanji: "思い直す", meaning: "다시 생각하다, 마음을 고쳐먹다", pos: "동사" },
    { kana: "どうよう", kanji: "動揺", meaning: "동요", pos: "명사·する동사" },
    { kana: "くだらない", kanji: "下らない", meaning: "시시하다, 하찮다", pos: "い형용사" },
    { kana: "こうふん", kanji: "昂奮", meaning: "흥분 (興奮의 옛 표기)", pos: "명사·する동사" },
    { kana: "はらをたてる", kanji: "腹を立てる", meaning: "화를 내다", pos: "관용구" },
    { kana: "およぶ", kanji: "及ぶ", meaning: "미치다, 이르다", pos: "동사" },
  ],
  N1: [
    { kana: "さかな", kanji: "肴", meaning: "안주 (술상에 올리는 음식)", pos: "명사" },
    { kana: "のど", kanji: "咽喉", meaning: "목구멍", pos: "명사" },
  ],
};

const newVocabIndex = new Map();
for (const [lv, words] of Object.entries(newVocab)) {
  const arr = vocabFiles[lv].words;
  for (const w of words) {
    const key = `${w.kanji}|${w.kana}`;
    arr.push(w);
    newVocabIndex.set(key, { level: lv, index: arr.length - 1 });
  }
}

// ============ HELPERS ============
const existingVocabIndex = new Map();
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  vocabFiles[lv].words.forEach((w, i) => {
    const key = `${w.kanji ?? w.kana}|${w.kana}`;
    if (!existingVocabIndex.has(key)) existingVocabIndex.set(key, { level: lv, index: i });
  });
}

function vref(kanji, reading) {
  const key = `${kanji}|${reading}`;
  return existingVocabIndex.get(key);
}

function makeVocab(items) {
  return items.map(([kanji, reading, meaning]) => {
    const ref = vref(kanji, reading);
    return ref ? { kanji, reading, meaning, ref } : { kanji, reading, meaning };
  });
}

// helper for hiragana tokens: alternating strong/plain
function hira(parts) {
  return parts.map(([t, e]) => ({ t, e: !!e }));
}

// ============ NEW NOVEL ENTRIES ============
const newEntries = [
  {
    id: 387, paragraph: 9,
    original: "私の腹の中には始終先刻の事が引っ懸かっていた。",
    hiragana: hira([
      ["わたくし", 1], ["の ", 0],
      ["はら", 1], ["の ", 0],
      ["なか", 1], ["には ", 0],
      ["しじゅう", 1], [" ", 0],
      ["さっき", 1], ["の ", 0],
      ["こと", 1], ["が ", 0],
      ["ひっかかっていた。", 0],
    ]),
    meaning: "내 마음속에는 줄곧 아까의 일이 걸려 있었다.",
    vocab: makeVocab([
      ["私", "わたくし", "나, 저 (격식체)"],
      ["腹", "はら", "배, 마음속"],
      ["中", "なか", "안, 속"],
      ["始終", "しじゅう", "줄곧, 시종"],
      ["先刻", "さっき", "아까, 조금 전"],
      ["事", "こと", "일"],
      ["引っ懸かる", "ひっかかる", "걸리다, 마음에 걸리다"],
    ]),
    grammar: [
      { element: "腹の中には", desc: "「腹」+「の中」+「には」. 직역 '배 속에는'이지만 '마음속에는'을 뜻하는 관용. 일본어에서 「腹」은 마음·속내를 가리키는 비유로 자주 쓰인다." },
      { element: "始終", desc: "부사. '내내, 줄곧'. 단발적이지 않은 지속을 강조한다." },
      { element: "先刻の事", desc: "「先刻(さっき)」+「の事」. '아까의 일'. 「先(さき)」보다 격식 있고 시간적 선후를 또렷이 한다." },
      { element: "引っ懸かっていた", desc: "「引っ懸かる」의 て형 + 「いた」. '계속 걸려 있었다'의 지속 상태." },
    ],
    notes: [
      { title: "「걸렸다」의 부수적 의미", body: "물리적으로 무언가에 걸리듯, 마음 한 구석에 무엇이 박혀 있는 감각. 다음 문장(388)의 「肴の骨が咽喉に刺さった」 비유와 직접 호응하며 신체화된 불안의 첫 줄이 된다." },
      { title: "「腹」 모티프의 시작", body: "일본어에서는 마음·속내를 「腹」으로 표현하는 관용이 깊다(腹を立てる, 腹を割る 등). 같은 단락 끝부분 394번에 등장하는 「腹を立てた」와 호응 — 9단락의 키워드 「腹」이 첫 줄에서 깔리고 마지막 발화에서 닫히는 구조." },
    ],
  },
  {
    id: 388, paragraph: 9,
    original: "肴の骨が咽喉に刺さった時のように、私は苦しんだ。",
    hiragana: hira([
      ["さかな", 1], ["の ", 0],
      ["ほね", 1], ["が ", 0],
      ["のど", 1], ["に ", 0],
      ["ささ", 1], ["った ", 0],
      ["とき", 1], ["のように、 ", 0],
      ["わたくし", 1], ["は ", 0],
      ["くる", 1], ["しんだ。", 0],
    ]),
    meaning: "생선 뼈가 목구멍에 박혔을 때처럼, 나는 괴로워했다.",
    vocab: makeVocab([
      ["肴", "さかな", "안주, 생선"],
      ["骨", "ほね", "뼈"],
      ["咽喉", "のど", "목구멍"],
      ["刺さる", "ささる", "박히다, 꽂히다"],
      ["時", "とき", "때"],
      ["私", "わたくし", "나, 저 (격식체)"],
      ["苦しむ", "くるしむ", "괴로워하다"],
    ]),
    grammar: [
      { element: "肴の骨", desc: "「肴(さかな)」+「の骨」. 「肴」는 일반적인 「魚」와 달리 술안주·반찬으로의 생선을 뜻하는 운치 있는 어휘. 메이지 문체의 흔적." },
      { element: "〜時のように", desc: "동사 과거형 + 「時」+「のように」. '〜했을 때처럼'. 비유 표현." },
      { element: "苦しんだ", desc: "「苦しむ」의 과거. 신체적 괴로움뿐 아니라 정신적 괴로움까지 포함하는 동사." },
    ],
    notes: [
      { title: "추상의 신체화", body: "387번의 '걸려 있었다'를 388번에서 '뼈가 박힌 듯한 통증'으로 구체화. 추상적 불안을 신체 감각으로 번역하는 소세키의 전형적 수법." },
      { title: "「肴」와 「魚」의 결", body: "같은 さかな로 읽지만 「肴」는 술자리·식탁의 정취까지 함께 환기. 단순한 생선이 아니라, 일상 속 풍경에서 갑자기 박혀 든 가시 — 화자가 평소의 시간 안에서 별안간 마주친 통증을 암시한다." },
    ],
  },
  {
    id: 389, paragraph: 9,
    original: "打ち明けてみようかと考えたり、止した方が好かろうかと思い直したりする動揺が、妙に私の様子をそわそわさせた。",
    hiragana: hira([
      ["うちあ", 1], ["けてみようかと ", 0],
      ["かんが", 1], ["えたり、 ", 0],
      ["よ", 1], ["した ", 0],
      ["ほう", 1], ["が ", 0],
      ["よ", 1], ["かろうかと ", 0],
      ["おもいなお", 1], ["したりする ", 0],
      ["どうよう", 1], ["が、 ", 0],
      ["みょう", 1], ["に ", 0],
      ["わたくし", 1], ["の ", 0],
      ["ようす", 1], ["をそわそわさせた。", 0],
    ]),
    meaning: "털어놓아 볼까 생각하기도, 그만두는 편이 낫지 않을까 다시 생각하기도 하는 동요가, 묘하게도 내 모습을 안절부절하게 만들었다.",
    vocab: makeVocab([
      ["打ち明ける", "うちあける", "털어놓다"],
      ["考える", "かんがえる", "생각하다"],
      ["止す", "よす", "그만두다"],
      ["方", "ほう", "쪽, 편"],
      ["好い", "よい", "좋다"],
      ["思い直す", "おもいなおす", "다시 생각하다"],
      ["動揺", "どうよう", "동요"],
      ["妙", "みょう", "묘함, 이상함"],
      ["私", "わたくし", "나"],
      ["様子", "ようす", "모습, 모양"],
    ]),
    grammar: [
      { element: "打ち明けてみようか", desc: "「打ち明ける」의 て형 +「みる」(시도)+「ようか」(의지·의문). '털어놓아 볼까'." },
      { element: "〜たり〜たりする動揺", desc: "「Aたり Bたりする」 동작 열거 + 「動揺」. '〜하기도 〜하기도 하는 동요'. 두 동작의 진동을 명사로 객관화." },
      { element: "止した方が好かろうか", desc: "「止す」 과거 + 「方が」(쪽이) + 「好い」의 추량형 「好かろう」 + 「か」. '그만두는 편이 낫지 않을까'. 「好かろう」는 「いいだろう」의 문어체." },
      { element: "妙に〜させた", desc: "「妙に」(묘하게) + 사역. '묘하게 〜하게 만들었다'. 외부 원인이 화자의 모습을 흔드는 구도." },
      { element: "そわそわ", desc: "의태어. 안절부절. 추상명사 「動揺」의 결과를 일상어로 받아내는 낙차." },
    ],
    notes: [
      { title: "두 동사의 대구", body: "「考えたり / 思い直したり」가 정확히 대구. 결정하지 못하고 좌우로 흔들리는 마음의 양태를 두 동사의 たり 구문으로 시각화." },
      { title: "마음에서 신체로의 흐름", body: "마음의 상태를 「動揺」라는 추상명사로 객관화한 뒤, 그것이 다시 신체(様子)를 흔드는 구조. 추상 → 신체로 흘러가는 인과의 한 줄." },
      { title: "한자어와 의태어의 낙차", body: "무거운 한자어 「動揺」를 가벼운 의태어 「そわそわ」가 받아내는 대비. 이 낙차가 인물의 미세한 흔들림을 살린다." },
    ],
  },
  {
    id: 390, paragraph: 9,
    original: "「君、今夜はどうかしていますね」と先生の方からいい出した。「実は私も少し変なのですよ。君に分りますか」",
    hiragana: hira([
      ["「", 0], ["きみ", 1], ["、 ", 0],
      ["こんや", 1], ["はどうかしていますね」と ", 0],
      ["せんせい", 1], ["の ", 0],
      ["ほう", 1], ["から ", 0],
      ["い", 1], ["い ", 0],
      ["だ", 1], ["した。「 ", 0],
      ["じつ", 1], ["は ", 0],
      ["わたくし", 1], ["も ", 0],
      ["すこ", 1], ["し ", 0],
      ["へん", 1], ["なのですよ。 ", 0],
      ["きみ", 1], ["に ", 0],
      ["わか", 1], ["りますか」", 0],
    ]),
    meaning: "\"자네, 오늘 밤은 어딘가 좀 이상하군요\"라고 선생님 쪽에서 먼저 말을 꺼냈다. \"실은 나도 좀 이상한 것이지요. 자네는 알겠습니까\"",
    vocab: makeVocab([
      ["君", "きみ", "자네"],
      ["今夜", "こんや", "오늘 밤"],
      ["先生", "せんせい", "선생님"],
      ["方", "ほう", "쪽"],
      ["言い出す", "いいだす", "말을 꺼내다"],
      ["実は", "じつは", "실은"],
      ["私", "わたくし", "나"],
      ["少し", "すこし", "조금"],
      ["変", "へん", "이상함"],
      ["分る", "わかる", "알다"],
    ]),
    grammar: [
      { element: "どうかしていますね", desc: "「どうかする」(뭔가 이상하다)의 て형 + 「いる」 + 「ね」. '어딘가 이상한 상태'. 종조사 「ね」로 단정을 부드럽게 한다." },
      { element: "〜の方から", desc: "'〜쪽에서'. 「先生の方から」 = '선생님 쪽에서 (먼저)'. 화자가 아닌 선생님이 먼저라는 점을 강조." },
      { element: "いい出した", desc: "「言い出す」의 과거. '말을 꺼내다, 먼저 입을 떼다'. 침묵을 깨고 발화를 시작했다는 의미가 동사 자체에 내장." },
      { element: "〜なのですよ", desc: "「〜なのです」+「よ」. 단정 + 알림의 종조사. 조심스럽게 자기 상태를 통보하는 부드러운 어조." },
      { element: "君に分りますか", desc: "「君に」(자네에게) + 「分る」(알다)의 의문. '자네는 (이걸) 알겠습니까'. 상대의 이해 가능 여부를 가늠하는 질문." },
    ],
    notes: [
      { title: "관계의 역전", body: "지금까지 화자가 선생님에게 다가가는 방향이었다면, 이 문장은 「先生の方から」 즉 선생님이 먼저 말을 거는 첫 장면. 두 사람의 거리가 한 단계 안쪽으로 들어왔음을 알리는 결정적 신호." },
      { title: "「実は私も」의 「も」", body: "'나도'라는 한 글자가 결정적. 화자의 동요를 선생님이 알아차렸음을 전제로 깔고, 자기도 같은 상태임을 인정하는 동등한 자기 노출. 386번 「気の毒そうに聞いた」의 공감을 받아 '나도 그렇다'로 응답하는 구조." },
      { title: "「分りますか」의 무게", body: "선생님이 처음으로 자기 내면을 화자에게 직접 묻는 순간. 이 질문은 다음 문장 391번에서 화자가 답하지 못하는 침묵으로 이어진다." },
    ],
  },
  {
    id: 391, paragraph: 9,
    original: "私は何の答えもし得なかった。",
    hiragana: hira([
      ["わたくし", 1], ["は ", 0],
      ["なん", 1], ["の ", 0],
      ["こた", 1], ["えもし ", 0],
      ["え", 1], ["なかった。", 0],
    ]),
    meaning: "나는 아무런 대답도 할 수 없었다.",
    vocab: makeVocab([
      ["私", "わたくし", "나"],
      ["何", "なに", "무엇"],
      ["答え", "こたえ", "대답"],
      ["得る", "える", "할 수 있다 (가능 보조동사)"],
    ]),
    grammar: [
      { element: "何の答えも", desc: "「何の〜も」(어떤 〜도) + 부정. '어떤 대답도'. 부분 부정이 아닌 전면 부정." },
      { element: "し得なかった", desc: "「する」의 연용형 「し」 + 「得る」의 부정 과거. '할 수 없었다'. 단순한 「できなかった」보다 격식 있고 무거운 문어체 가능 부정." },
    ],
    notes: [
      { title: "「し得なかった」의 문체", body: "「できなかった」가 아닌 「し得なかった」. 화자가 자기 자신의 침묵을 한 단계 떨어져 묘사하는 거리감. 메이지 교양인의 자의식적 문체." },
      { title: "침묵의 무게", body: "선생님의 「分りますか」(390)에 대한 답이 부재로 채워진다. 이 한 문장의 공백이 뒤이은 선생님의 자기 고백(392)을 가능하게 만든다 — 답을 안 한 것이 결과적으로 선생님의 두 번째 발언을 끌어내는 구조." },
    ],
  },
  {
    id: 392, paragraph: 9,
    original: "「実は先刻妻と少し喧嘩をしてね。それで下らない神経を昂奮させてしまったんです」と先生がまたいった。",
    hiragana: hira([
      ["「", 0], ["じつ", 1], ["は ", 0],
      ["さっき", 1], [" ", 0],
      ["さい", 1], ["と ", 0],
      ["すこ", 1], ["し ", 0],
      ["けんか", 1], ["をしてね。それで ", 0],
      ["くだ", 1], ["らない ", 0],
      ["しんけい", 1], ["を ", 0],
      ["こうふん", 1], ["させてしまったんです」と ", 0],
      ["せんせい", 1], ["がまた ", 0],
      ["い", 1], ["った。", 0],
    ]),
    meaning: "\"실은 아까 아내와 조금 다투었어요. 그래서 시시한 신경을 흥분시키고 말았답니다\"라고 선생님이 또 말했다.",
    vocab: makeVocab([
      ["実は", "じつは", "실은"],
      ["先刻", "さっき", "아까"],
      ["妻", "さい", "아내 (격식체)"],
      ["少し", "すこし", "조금"],
      ["喧嘩", "けんか", "싸움, 다툼"],
      ["下らない", "くだらない", "시시하다, 하찮다"],
      ["神経", "しんけい", "신경"],
      ["昂奮", "こうふん", "흥분"],
      ["先生", "せんせい", "선생님"],
    ]),
    grammar: [
      { element: "妻と少し喧嘩をして", desc: "「妻と〜をする」구문. 「喧嘩をする」 = 다투다. 「と」가 상대를, 「を」가 행위를 잡아낸다." },
      { element: "〜してね", desc: "て형 + 종조사 「ね」. 부드러운 종지 + 동의 유도. 단정이 아닌 공감을 청하는 어조." },
      { element: "下らない神経", desc: "「下らない」(시시한) + 「神経」(신경). '하찮은 자기 신경'을 자조적으로 객관화한 표현. 자기 감정을 비웃듯 거리를 두는 화법." },
      { element: "昂奮させてしまった", desc: "「昂奮する」의 사역 「昂奮させる」 + 「〜てしまう」(해 버리다)의 과거. 자기 의지에 반해 흥분해 버렸다는 후회의 뉘앙스." },
    ],
    notes: [
      { title: "「妻」를 「さい」로 읽기", body: "보통 「つま」로 읽는 글자를 「さい」로 읽는 메이지 격식체. 격식 있는 자기 호칭 「私(わたくし)」와 같은 결의 문체적 일관성. 같은 단락 397번 「妻が考えているような人間なら」의 「さい」와도 호응." },
      { title: "자기 신경의 객관화", body: "'내가 흥분했다'가 아니라 '하찮은 신경을 흥분시켜 버렸다'. 자신의 감정을 한 발짝 떨어진 위치에서 관조하는 선생님 특유의 거리. 같은 단락 386번 「気の毒そうに聞いた」와 톤이 일치 — 자기 감정도 타인 다루듯." },
      { title: "「またいった」의 「また」", body: "첫 번째 발화(390) → 침묵(391) → 두 번째 발화(392). 화자의 침묵이 오히려 선생님의 두 번째 발언을 끌어낸 구조. 「また」가 그 흐름을 한 글자로 잡아낸다." },
    ],
  },
  {
    id: 393, paragraph: 9,
    original: "「どうして……」私には喧嘩という言葉が口へ出て来なかった。",
    hiragana: hira([
      ["「どうして……」 ", 0],
      ["わたくし", 1], ["には ", 0],
      ["けんか", 1], ["という ", 0],
      ["ことば", 1], ["が ", 0],
      ["くち", 1], ["へ ", 0],
      ["で", 1], ["て ", 0],
      ["こ", 1], ["なかった。", 0],
    ]),
    meaning: "\"어째서……\" 나에게는 '싸움'이라는 말이 입에서 나오지 않았다.",
    vocab: makeVocab([
      ["私", "わたくし", "나"],
      ["喧嘩", "けんか", "싸움"],
      ["言葉", "ことば", "말"],
      ["口", "くち", "입"],
      ["出る", "でる", "나오다"],
      ["来る", "くる", "오다"],
    ]),
    grammar: [
      { element: "「どうして……」", desc: "의문사 + 말줄임표. 끝맺지 못한 질문. 화자가 끝까지 묻지 못하고 말이 끊김." },
      { element: "〜という言葉", desc: "「〜라는 말」. 단어 자체를 화제로 들어 올리는 표현. 「喧嘩」라는 단어 자체에 화자가 걸려 있음을 부각." },
      { element: "口へ出て来なかった", desc: "「口へ出る」(입에 오르다) + 「出て来る」(나오다)의 부정 과거. '입 밖으로 나오지 않았다'. 의지의 부재가 아닌, 말이 스스로 나오지 못한 무력함." },
    ],
    notes: [
      { title: "말줄임표(……)의 기능", body: "'어째서 그랬습니까' 같은 완결 문장이 아니라 「どうして」 한 단어에서 끊김. 화자의 머뭇거림과 다음 문장의 자기 분석을 동시에 가능하게 하는 침묵의 표지." },
      { title: "「喧嘩」를 입에 올리지 못함", body: "392번에서 선생님이 직접 「喧嘩」라고 말했음에도, 화자는 그 단어를 따라 발음하지 못한다. 부부의 다툼이라는 사적 영역에 들어서기를 망설이는 화자의 거리감이 한 어휘에 응축." },
    ],
  },
  {
    id: 394, paragraph: 9,
    original: "「妻が私を誤解するのです。それを誤解だといって聞かせても承知しないのです。つい腹を立てたのです」",
    hiragana: hira([
      ["「", 0], ["さい", 1], ["が ", 0],
      ["わたくし", 1], ["を ", 0],
      ["ごかい", 1], ["するのです。それを ", 0],
      ["ごかい", 1], ["だといって ", 0],
      ["き", 1], ["かせても ", 0],
      ["しょうち", 1], ["しないのです。つい ", 0],
      ["はら", 1], ["を ", 0],
      ["た", 1], ["てたのです」", 0],
    ]),
    meaning: "\"아내가 나를 오해하는 겁니다. 그것이 오해라고 일러 주어도 받아들이지 않습니다. 그만 화를 내고 만 겁니다\"",
    vocab: makeVocab([
      ["妻", "さい", "아내"],
      ["私", "わたくし", "나"],
      ["誤解", "ごかい", "오해"],
      ["聞かせる", "きかせる", "들려주다, 일러 주다"],
      ["承知", "しょうち", "승낙, 받아들임"],
      ["腹を立てる", "はらをたてる", "화를 내다"],
    ]),
    grammar: [
      { element: "〜のです", desc: "강한 단정·설명의 종지. 자기 행동의 이유를 차근차근 풀어 놓는 어조." },
      { element: "いって聞かせても", desc: "「いう」의 て형 + 「聞かせる」 + 「ても」(~해도). '말해 들려줘도'. 정성 들여 설명하는 동작을 한 번 더 강조." },
      { element: "承知しない", desc: "「承知する」(수긍·승낙)의 부정. '받아들이지 않는다'. 단순한 「分らない」가 아니라 의지적 거부에 가까운 어휘." },
      { element: "つい腹を立てた", desc: "「つい」(그만, 무심코) + 「腹を立てる」(화내다)의 과거. 의도하지 않았는데 그만 화를 냈다는 자기 변호의 부사." },
    ],
    notes: [
      { title: "세 개의 「のです」", body: "세 문장 모두 「のです」로 끝맺음. 자기 행동을 합리화·설명하려는 어조의 반복. 단호한 단정이 아니라 '왜 이렇게 됐는지'를 풀어 놓는 진술의 리듬." },
      { title: "「腹を立てる」의 등장", body: "387번 「腹の中」에서 시작된 '腹' 모티프가 이 문장의 「腹を立てた」로 닫히는 구조. 단락 첫 줄의 '마음속'과 끝 무렵의 '화남'이 모두 「腹」 한 글자로 묶인다." },
      { title: "「つい」의 자기 변호", body: "'그만 ~하고 말았다'. 자기 행동을 인정하면서도 한 발 빼는 어휘. 「昂奮させてしまった」(392)와 톤이 일치 — 책임을 지면서도 거리를 두는 선생님 특유의 화법." },
    ],
  },
  {
    id: 395, paragraph: 9,
    original: "「どんなに先生を誤解なさるんですか」",
    hiragana: hira([
      ["「どんなに ", 0],
      ["せんせい", 1], ["を ", 0],
      ["ごかい", 1], ["なさるんですか」", 0],
    ]),
    meaning: "\"얼마나 선생님을 오해하시는 건가요\"",
    vocab: makeVocab([
      ["先生", "せんせい", "선생님"],
      ["誤解", "ごかい", "오해"],
    ]),
    grammar: [
      { element: "どんなに〜か", desc: "'얼마나 〜하는가'. 정도를 묻는 의문. 내용이 아니라 정도를 먼저 묻는 우회." },
      { element: "誤解なさる", desc: "「誤解する」의 존경어 「なさる」형. 사모님(선생님의 妻)의 행위를 높이는 정중한 표현. 화자의 격식이 드러난다." },
      { element: "〜んですか", desc: "「〜のですか」의 회화체. 사정·이유를 묻는 부드러운 의문." },
    ],
    notes: [
      { title: "화자의 존경어 사용", body: "사모님을 가리키며 「誤解なさる」 존경어를 쓴다. 화자가 선생님 부부 양쪽 모두에게 격을 두고 있음을 보여 주는 작은 표지." },
      { title: "첫 능동적 질문", body: "391번에서 답하지 못했던 화자, 393번에서 「喧嘩」를 발음하지 못했던 화자가 여기서 처음으로 선생님 가정사에 대해 적극적 질문을 던진다. 거리를 좁히는 한 발." },
      { title: "'얼마나'라는 정도 질문", body: "오해의 내용을 직접 묻기보다 오해의 정도부터 묻는 우회. 직접적 추궁을 피하면서도 핵심을 향해 가는 신중한 접근. 이 우회가 다음 문장 396번의 거부를 부드럽게 받아내는 완충이 된다." },
    ],
  },
  {
    id: 396, paragraph: 9,
    original: "先生は私のこの問いに答えようとはしなかった。",
    hiragana: hira([
      ["せんせい", 1], ["は ", 0],
      ["わたくし", 1], ["のこの ", 0],
      ["と", 1], ["いに ", 0],
      ["こた", 1], ["えようとはしなかった。", 0],
    ]),
    meaning: "선생님은 나의 이 물음에 답하려고도 하지 않았다.",
    vocab: makeVocab([
      ["先生", "せんせい", "선생님"],
      ["私", "わたくし", "나"],
      ["問い", "とい", "물음"],
      ["答える", "こたえる", "대답하다"],
    ]),
    grammar: [
      { element: "私のこの問い", desc: "'나의 이 물음'. 「この」가 직전 395번을 가리키는 지시어. 직전 발화를 명사화하여 받음." },
      { element: "答えようとはしなかった", desc: "「答える」의 의지형 「答えよう」 + 「とする」(하려고 하다) + 「は」(강조) + 부정 과거. '답하려고도 하지 않았다'. 「は」가 들어가면서 거부의 의지가 한 단계 강해진다." },
    ],
    notes: [
      { title: "「は」 한 글자의 무게", body: "「答えようとしなかった」와 「答えようとはしなかった」는 다르다. 「は」가 들어가면 '답하려는 의지조차 보이지 않았다'로 거부의 단호함이 강해진다. 미세한 조사 한 글자가 선생님의 침묵을 결정적으로 만든다." },
      { title: "거리의 진동", body: "화자의 첫 능동적 질문(395) 직후 선생님의 즉답 거부. 한 발 다가간 만큼 한 발 물러서는 관계의 진동. 같은 단락 안에서 가까워졌다 멀어졌다를 반복하는 9단락 특유의 리듬." },
    ],
  },
  {
    id: 397, paragraph: 9,
    original: "「妻が考えているような人間なら、私だってこんなに苦しんでいやしない」",
    hiragana: hira([
      ["「", 0], ["さい", 1], ["が ", 0],
      ["かんが", 1], ["えているような ", 0],
      ["にんげん", 1], ["なら、 ", 0],
      ["わたくし", 1], ["だってこんなに ", 0],
      ["くる", 1], ["しんでいやしない」", 0],
    ]),
    meaning: "\"아내가 생각하고 있는 그런 인간이라면, 나라고 해서 이렇게 괴로워하지는 않을 것이다\"",
    vocab: makeVocab([
      ["妻", "さい", "아내"],
      ["考える", "かんがえる", "생각하다"],
      ["人間", "にんげん", "인간"],
      ["私", "わたくし", "나"],
      ["苦しむ", "くるしむ", "괴로워하다"],
    ]),
    grammar: [
      { element: "〜ような人間なら", desc: "'〜와 같은 인간이라면'. 가정 조건. 「ような」가 비유, 「なら」가 가정." },
      { element: "私だって", desc: "「私」+「だって」. 「も」보다 강한 강조의 「だって」. '나라고 해서'. 일반론에 자기를 끌어 넣어 부각하는 어조." },
      { element: "こんなに〜いやしない", desc: "「こんなに〜やしない」. 「いる」의 て형 + 「やしない」(=「はしない」의 회화체 강조 부정). '이렇게 〜하고 있지는 않을 거다'. 일상적 부정보다 강한 단호한 부정." },
    ],
    notes: [
      { title: "우회의 답", body: "396번에서 직접 답하지 않은 선생님이, 직접 답이 아니라 자기 고통의 강도를 통해 우회적으로 답한다. '아내가 생각하는 그런 인간이 아니다'라는 자기 부정이 곧 자기 변호." },
      { title: "「苦しんでいやしない」의 무게", body: "일상 회화에선 잘 쓰지 않는 강한 부정. 자기 괴로움을 단호하게 부각하는 동시에, 아내가 그 괴로움을 모른다는 단절감을 드러낸다." },
      { title: "자기 인식의 분열", body: "「妻が考えているような人間」 vs '실제의 나'. 타인이 보는 자기와 스스로 아는 자기의 불일치. 『こころ』 전체를 관통하는 '알 수 없음'의 모티프가 부부 사이에까지 펼쳐지는 장면." },
    ],
  },
  {
    id: 398, paragraph: 9,
    original: "先生がどんなに苦しんでいるか、これも私には想像の及ばない問題であった。",
    hiragana: hira([
      ["せんせい", 1], ["がどんなに ", 0],
      ["くる", 1], ["しんでいるか、これも ", 0],
      ["わたくし", 1], ["には ", 0],
      ["そうぞう", 1], ["の ", 0],
      ["およ", 1], ["ばない ", 0],
      ["もんだい", 1], ["であった。", 0],
    ]),
    meaning: "선생님이 얼마나 괴로워하고 있는지, 이것 또한 나에게는 상상이 미치지 않는 문제였다.",
    vocab: makeVocab([
      ["先生", "せんせい", "선생님"],
      ["苦しむ", "くるしむ", "괴로워하다"],
      ["私", "わたくし", "나"],
      ["想像", "そうぞう", "상상"],
      ["及ぶ", "およぶ", "미치다, 이르다"],
      ["問題", "もんだい", "문제"],
    ]),
    grammar: [
      { element: "どんなに〜か", desc: "정도의 의문. '얼마나 〜하는지'. 395번의 「どんなに先生を誤解なさるんですか」와 형태가 정확히 대구." },
      { element: "これも", desc: "'이것 또한'. 「も」가 결정적 — 다른 무언가에 더해 '이것까지'. 직전의 사모님 오해 정도와 묶어 놓는다." },
      { element: "想像の及ばない", desc: "「想像」+「の」+「及ぶ」 부정. '상상이 미치지 않는'. 직역하면 '상상의 도달이 닿지 않는'. 추상화된 격식 표현." },
      { element: "〜であった", desc: "「である」의 과거. 단정적 회상의 문어체. 회고하는 시점에서 당시를 되돌아보는 톤." },
    ],
    notes: [
      { title: "화자의 한계 자각", body: "395번에서 사모님의 오해 정도를 물었던 화자가, 398번에서는 선생님의 고통 정도를 자기 한계 너머의 것으로 인정. 한 단락 안에서 화자가 두 사람의 내면 모두 자기 손에 닿지 않음을 깨닫는다." },
      { title: "「これも」의 「も」", body: "「妻」와 「先生」 양쪽 모두 화자에겐 알 수 없는 영역임을 한 글자로 묶는다. 직전 395('아내가 얼마나 오해하는지')와 본 문장('선생님이 얼마나 괴로운지')이 「どんなに〜か」 구문으로 대구를 이룬다." },
      { title: "단락의 결말", body: "9단락 전체가 '가까워지면서도 닿지 못함'의 정조로 닫힌다. 같은 단락 386번 「気の毒そうに聞いた」가 화자 측 공감의 시작이었다면, 398번은 그 공감이 도달할 수 없는 한계의 자각. 공감과 한계가 한 단락 안에 공존." },
    ],
  },
];

// Append to novel.json
const existingIds = new Set(novel.map((it) => it.id));
let added = 0;
for (const e of newEntries) {
  if (existingIds.has(e.id)) {
    console.warn(`Skip: id ${e.id} already exists`);
    continue;
  }
  novel.push(e);
  added++;
}
novel.sort((a, b) => a.id - b.id);

// Update paragraph map - extend paragraph 9 range
const p9 = paraMap.paragraphs.find((p) => p.paragraph === 9);
if (p9) {
  p9.range[1] = Math.max(p9.range[1], 398);
}

// Write all files
writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
}
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Added ${added} novel entries (387-${387 + added - 1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji entries`);
let vSum = 0;
for (const lv of Object.keys(newVocab)) vSum += newVocab[lv].length;
console.log(`✓ Added ${vSum} vocab entries`);
console.log(`✓ Paragraph 9 range now [${p9.range[0]}, ${p9.range[1]}]`);
