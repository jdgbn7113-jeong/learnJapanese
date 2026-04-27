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

// ===== 1. Add new kanji =====
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
  "群": nk(
    "群", ["グン"], ["むれ", "む-れる"], ["무리", "떼"], "N3", 4, 13,
    [["君", "임금·지휘자", "left"], ["羊", "양", "right"]],
    "君(임금·지휘자)이 羊(양)을 거느려 모으면 — 한 덩어리로 움직이는 무리(群).",
    "임금 아래 양 떼 = 무리",
    [
      { word: "群集", reading: "ぐんしゅう", meaning: "군중" },
      { word: "群れ", reading: "むれ", meaning: "무리, 떼" },
    ],
  ),
  "集": nk(
    "集", ["シュウ"], ["あつ-まる", "あつ-める", "つど-う"], ["모으다", "모이다"], "N4", 3, 12,
    [["隹", "새", "top"], ["木", "나무", "bottom"]],
    "木(나무) 위에 隹(새)가 내려앉는 장면 — 흩어져 있던 것이 한자리에 모인다.",
    "나무 위에 새들이 모이다 = 집합",
    [
      { word: "集合", reading: "しゅうごう", meaning: "집합" },
      { word: "群集", reading: "ぐんしゅう", meaning: "군중" },
    ],
  ),
  "胸": nk(
    "胸", ["キョウ"], ["むね", "むな"], ["가슴", "마음"], "N3", 6, 10,
    [["月", "신체(고기 달)", "left"], ["匈", "감싼 속·흉부", "right"]],
    "月(신체) 가운데, 匈(감싸 품은 속)이 자리한 곳 — 감정과 숨이 담기는 가슴.",
    "몸속에 감싸인 자리 = 가슴",
    [
      { word: "胸", reading: "むね", meaning: "가슴" },
      { word: "胸中", reading: "きょうちゅう", meaning: "마음속, 심중" },
    ],
  ),
  "虚": nk(
    "虚", ["キョ", "コ"], ["むな-しい", "うつ-ろ"], ["비다", "헛되다"], "N1", 7, 11,
    [["虍", "호피 무늬(지붕)", "top"], ["业", "밑받침·터", "bottom"]],
    "虍(호피 무늬 지붕) 아래 业(터)가 있지만 안은 텅 비어 — 겉만 있고 속은 없는 상태.",
    "무늬뿐인 지붕 아래 텅 빔 = 허(虚)",
    [
      { word: "空虚", reading: "くうきょ", meaning: "공허" },
      { word: "虚しい", reading: "むなしい", meaning: "허무하다, 덧없다" },
    ],
  ),
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ===== 2. Add new vocab =====
const newVocab = {
  N5: [
    { kana: "もり", kanji: "森", meaning: "숲", pos: "명사" },
  ],
  N4: [
    { kana: "むね", kanji: "胸", meaning: "가슴, 마음속", pos: "명사" },
    { kana: "しらべる", kanji: "調べる", meaning: "조사하다, 살펴보다", pos: "동사" },
  ],
  N3: [
    { kana: "くちにする", kanji: "口にする", meaning: "입에 올리다, 말하다", pos: "동사" },
    { kana: "いまに", kanji: "今に", meaning: "곧, 머지않아", pos: "부사" },
    { kana: "いちおう", kanji: "一応", meaning: "일단, 우선", pos: "부사" },
  ],
  N2: [
    { kana: "ぐんしゅう", kanji: "群集", meaning: "군중, 무리", pos: "명사" },
    { kana: "おもいあたる", kanji: "思いあたる", meaning: "짚이다, 생각나다", pos: "동사" },
    { kana: "もくてきぶつ", kanji: "目的物", meaning: "목적물, 대상", pos: "명사" },
    { kana: "とっくのむかし", kanji: "とっくの昔", meaning: "오래전, 한참 전", pos: "명사" },
  ],
  N1: [
    { kana: "くうきょ", kanji: "空虚", meaning: "공허함, 텅 빔", pos: "명사·な형용사" },
  ],
};

// Track new vocab indices
const idx = {};
for (const [lv, items] of Object.entries(newVocab)) {
  const arr = vocab[lv].words;
  for (const item of items) {
    arr.push(item);
    idx[item.kanji] = { level: lv, index: arr.length - 1 };
  }
}

// Existing vocab refs
const ref = {
  "我々": { level: "N2", index: 48 },
  "嬉しい": { level: "N4", index: 130 },
  "顔": { level: "N5", index: 152 },
  "中": { level: "N5", index: 424 },
  "通り抜ける": { level: "N2", index: 21 },
  "花": { level: "N5", index: 497 },
  "人": { level: "N5", index: 509 },
  "見える": { level: "N5", index: 623 },
  "同じ": { level: "N5", index: 124 },
  "問題": { level: "N5", index: 579 },
  "機会": { level: "N3", index: 81 },
  "恋": { level: "N4", index: 229 },
  "罪悪": { level: "N2", index: 296 },
  "私": { level: "N3", index: 43 },
  "時": { level: "N5", index: 403 },
  "突然": { level: "N3", index: 112 },
  "聞く": { level: "N5", index: 182 },
  "答える": { level: "N5", index: 236 },
  "先生": { level: "N5", index: 337 },
  "語気": { level: "N1", index: 181 },
  "前": { level: "N5", index: 542 },
  "強い": { level: "N5", index: 382 },
  "解る": { level: "N3", index: 120 },
  "あなた": { level: "N5", index: 23 },
  "心": { level: "N5", index: 648 },
  "昔": { level: "N5", index: 723 },
  "動く": { level: "N5", index: 80 },
  "自分": { level: "N4", index: 26 },
  "案外": { level: "N4", index: 202 },
  "何": { level: "N5", index: 434 },
  "一つ": { level: "N5", index: 510 },
  "隠す": { level: "N4", index: 24 },
  "つもり": { level: "N4", index: 63 },
  "落ち付く": { level: "N4", index: 102 },
  "思う": { level: "N5", index: 135 },
  "いずれ": { level: "N4", index: 157 },
};
// Merge new refs
Object.assign(ref, idx);

const V = (k, r, m, word) => ({
  kanji: k,
  reading: r,
  meaning: m,
  ...(ref[word ?? k] ? { ref: ref[word ?? k] } : {}),
});

// ===== 3. Add sentences 511-519 =====
const h = (t, e = false) => ({ t, e });

const sentences = [
  {
    id: 511,
    paragraph: 13,
    original: "我々は群集の中にいた。群集はいずれも嬉うれしそうな顔をしていた。",
    hiragana: [
      h("われわれ", true), h("は ", false),
      h("ぐんしゅう", true), h("の ", false),
      h("なか", true), h("にいた。 ", false),
      h("ぐんしゅう", true), h("はいずれも ", false),
      h("うれ", true), h("しそうな ", false),
      h("かお", true), h("をしていた。", false),
    ],
    meaning: "우리는 군중 속에 있었다. 군중은 누구나 기뻐 보이는 얼굴을 하고 있었다.",
    vocab: [
      V("我々", "われわれ", "우리"),
      V("群集", "ぐんしゅう", "군중"),
      V("中", "なか", "속, 안"),
      V("いずれ", "いずれも", "누구나, 모두"),
      V("嬉しい", "うれしい", "기쁘다"),
      V("顔", "かお", "얼굴"),
    ],
    grammar: [
      { element: "我々", desc: "「私たち」보다 문어적·남성적 1인칭 복수. 선생님과 화자를 한 묶음으로 부각." },
      { element: "いずれも", desc: "「어느 것이든 모두」. 군중 전체가 예외 없이 한 표정이라는 강조." },
      { element: "〜そうな顔", desc: "양태 조동사 「そうだ」의 연체형. 외관상의 추측 — '~해 보이는 얼굴'." },
    ],
    notes: [
      {
        title: "우에노 꽃놀이 장면",
        body: "497 「上野へ行った」의 공간을 이어받은 장면. 벚꽃 철 우에노 공원은 당시 도쿄에서 가장 붐비는 행락지.",
      },
      {
        title: "「我々」의 선택",
        body: "앞 단락이 「私」 중심이었던 데 비해, 13단락은 「我々」로 시작해 '둘이 한 묶음'이 된 순간을 연다. 선생님과 화자가 '같이 보고 있는' 시점.",
      },
    ],
    translations: {
      literal: "우리는 군중 속에 있었다. 군중은 누구나 기뻐 보이는 얼굴을 하고 있었다.",
      liberal: "우리는 꽃놀이 인파 한가운데에 서 있었다. 사람들 하나하나가 어느 모로 보나 들뜬 얼굴을 하고 있었다.",
    },
  },
  {
    id: 512,
    paragraph: 13,
    original:
      "そこを通り抜けて、花も人も見えない森の中へ来るまでは、同じ問題を口にする機会がなかった。",
    hiragana: [
      h("そこを ", false),
      h("とお", true), h("り", false),
      h("ぬ", true), h("けて、 ", false),
      h("はな", true), h("も ", false),
      h("ひと", true), h("も ", false),
      h("み", true), h("えない ", false),
      h("もり", true), h("の ", false),
      h("なか", true), h("へ ", false),
      h("く", true), h("るまでは、 ", false),
      h("おな", true), h("じ ", false),
      h("もんだい", true), h("を ", false),
      h("くち", true), h("にする ", false),
      h("きかい", true), h("がなかった。", false),
    ],
    meaning:
      "그곳을 지나쳐, 꽃도 사람도 보이지 않는 숲속으로 들어오기까지는, 같은 이야기를 입에 올릴 기회가 없었다.",
    vocab: [
      V("通り抜ける", "とおりぬける", "지나쳐 나오다"),
      V("花", "はな", "꽃"),
      V("人", "ひと", "사람"),
      V("見える", "みえる", "보이다"),
      V("森", "もり", "숲"),
      V("中", "なか", "속, 안"),
      V("同じ", "おなじ", "같다"),
      V("問題", "もんだい", "문제, 화제"),
      V("口にする", "くちにする", "입에 올리다, 말하다"),
      V("機会", "きかい", "기회"),
    ],
    grammar: [
      { element: "花も人も見えない", desc: "「〜も〜も〜ない」 부정 병렬. 두 요소가 모두 없는 상태를 한꺼번에 부정." },
      { element: "口にする", desc: "「話す」보다 무게가 있는 표현. '말로 꺼내다, 입에 올리다'." },
      { element: "〜までは…がなかった", desc: "'~할 때까지는 ~이 없었다'. 시점의 경계를 분명히 긋는 구문." },
    ],
    notes: [
      {
        title: "군중 → 숲의 이동",
        body: "'꽃도 사람도 보이지 않는 숲속'까지 와서야 화제를 꺼낸다. 509 「恋は罪悪」라는 무거운 명제를 말하기 위해 선생님과 화자가 둘이 될 수 있는 공간을 필요로 한 것.",
      },
      {
        title: "「同じ問題」의 지시",
        body: "509 선생님이 꺼낸 「恋は罪悪」. 이 공간적 이동 뒤에 다시 이 주제로 돌아간다는 예고.",
      },
    ],
    translations: {
      literal:
        "그곳을 지나쳐, 꽃도 사람도 보이지 않는 숲 속으로 들어올 때까지는, 같은 화제를 입에 올릴 기회가 없었다.",
      liberal:
        "그 인파를 뚫고 꽃도 사람도 시야에서 사라진 숲속에 이르기 전까지는, 같은 이야기를 다시 꺼낼 기회가 좀처럼 주어지지 않았다.",
    },
  },
  {
    id: 513,
    paragraph: 13,
    original: "「恋は罪悪ですか」と私わたくしがその時突然聞いた。",
    hiragana: [
      h("「 ", false),
      h("こい", true), h("は ", false),
      h("ざいあく", true), h("ですか」と ", false),
      h("わたくし", true), h("がその ", false),
      h("とき", true), h(" ", false),
      h("とつぜん", true), h(" ", false),
      h("き", true), h("いた。", false),
    ],
    meaning: "「사랑은 죄악입니까」라고 내가 그때 갑자기 물었다.",
    vocab: [
      V("恋", "こい", "사랑, 연애"),
      V("罪悪", "ざいあく", "죄악"),
      V("私", "わたくし", "나"),
      V("時", "とき", "때"),
      V("突然", "とつぜん", "갑자기"),
      V("聞く", "きく", "묻다, 듣다"),
    ],
    grammar: [
      { element: "〜と聞いた", desc: "「と」 인용조사 + 「聞く」의 '묻다' 의미. 직접 인용 뒤의 물음." },
      { element: "突然", desc: "'갑자기'. 침묵 끝에 튀어나온 발화임을 강조." },
    ],
    notes: [
      {
        title: "화자가 먼저 꺼내는 주제",
        body: "509에서 선생님이 던진 「恋は罪悪」를 이번에는 화자가 되받아 물음의 형태로 돌려준다. 12단락 510 「何とも返事をしなかった」의 침묵이 13단락에서 깨지는 지점.",
      },
    ],
    translations: {
      literal: "「사랑은 죄악입니까」라고 내가 그때 갑자기 물었다.",
      liberal: "「사랑은 죄악이란 말씀입니까」 하고 나는 바로 그 순간, 느닷없이 입을 뗐다.",
    },
  },
  {
    id: 514,
    paragraph: 13,
    original: "「罪悪です。たしかに」と答えた時の先生の語気は前と同じように強かった。",
    hiragana: [
      h("「 ", false),
      h("ざいあく", true), h("です。たしかに」と ", false),
      h("こた", true), h("えた ", false),
      h("とき", true), h("の ", false),
      h("せんせい", true), h("の ", false),
      h("ごき", true), h("は ", false),
      h("まえ", true), h("と ", false),
      h("おな", true), h("じように ", false),
      h("つよ", true), h("かった。", false),
    ],
    meaning: "「죄악입니다. 분명히」라고 답한 때의 선생님의 어조는 이전과 똑같이 강했다.",
    vocab: [
      V("罪悪", "ざいあく", "죄악"),
      V("答える", "こたえる", "답하다"),
      V("時", "とき", "때"),
      V("先生", "せんせい", "선생"),
      V("語気", "ごき", "어조, 말투"),
      V("前", "まえ", "앞, 이전"),
      V("同じ", "おなじ", "같다"),
      V("強い", "つよい", "강하다"),
    ],
    grammar: [
      { element: "たしかに", desc: "'분명히, 틀림없이'. 앞선 단언 「罪悪です」에 쐐기를 박는 부사." },
      { element: "前と同じように", desc: "「A と同じ B」. '이전(509)과 동일한 방식으로' — 앞 발화와의 연속성을 명시." },
    ],
    notes: [
      {
        title: "두 번째 선언의 무게",
        body: "509에서 '사랑은 죄악이다'를 처음 말했을 때의 「強い調子」가, 화자의 물음(513) 앞에서도 조금도 흐트러지지 않고 유지된다. 선생님의 확신이 충동이 아니었음을 보여 주는 장치.",
      },
    ],
    translations: {
      literal: "「죄악입니다. 분명히」 하고 답한 때의 선생의 어조는 이전과 똑같이 강했다.",
      liberal:
        "「죄악이라네. 그것도 틀림없이」라고 답하는 그 순간, 선생님의 어조는 조금 전과 조금도 달라지지 않을 만큼 단호했다.",
    },
  },
  {
    id: 515,
    paragraph: 13,
    original: "「なぜですか」",
    hiragana: [h("「なぜですか」", false)],
    meaning: "「어째서입니까」",
    vocab: [],
    grammar: [
      { element: "なぜですか", desc: "이유를 구하는 가장 단순한 물음. 앞선 단정의 '근거'로 대화를 전환." },
    ],
    notes: [
      {
        title: "한 줄짜리 문장의 리듬",
        body: "짧은 한 문장이 그 자체로 하나의 호흡이 된다. 선생님의 단언 → 침묵 → 물음 → 답의 계단식 전개 속 '계단 한 칸'의 역할.",
      },
    ],
    translations: {
      literal: "「어째서입니까」",
      liberal: "「어째서 그런 것입니까」",
    },
  },
  {
    id: 516,
    paragraph: 13,
    original:
      "「なぜだか今に解ります。今にじゃない、もう解っているはずです。あなたの心はとっくの昔からすでに恋で動いているじゃありませんか」",
    hiragana: [
      h("「なぜだか ", false),
      h("いま", true), h("に ", false),
      h("わか", true), h("ります。 ", false),
      h("いま", true), h("にじゃない、もう ", false),
      h("わか", true), h("っているはずです。あなたの ", false),
      h("こころ", true), h("はとっくの ", false),
      h("むかし", true), h("からすでに ", false),
      h("こい", true), h("で ", false),
      h("うご", true), h("いているじゃありませんか」", false),
    ],
    meaning:
      "「어째서인지는 머지않아 알게 됩니다. 머지않아가 아니라, 이미 알고 있을 터입니다. 당신의 마음은 진작부터 이미 사랑에 움직이고 있지 않습니까」",
    vocab: [
      V("今に", "いまに", "머지않아, 곧"),
      V("解る", "わかる", "알다"),
      V("あなた", "あなた", "당신"),
      V("心", "こころ", "마음"),
      V("とっくの昔", "とっくのむかし", "오래전, 진작"),
      V("恋", "こい", "사랑"),
      V("動く", "うごく", "움직이다"),
    ],
    grammar: [
      { element: "〜はずです", desc: "당연·강한 추정. '~할 터입니다'. 말하는 이가 근거를 쥐고 있음을 드러냄." },
      { element: "とっくの昔から", desc: "'진작부터, 한참 전부터'. 「すでに」와 겹쳐 이미 그 상태임을 이중으로 강조." },
      {
        element: "〜じゃありませんか",
        desc: "'~잖습니까'. 상대가 모르는 척하는 사실을 '네가 안다'고 되돌리는 반문 — 선생님이 화자의 무의식을 들이미는 장치.",
      },
    ],
    notes: [
      {
        title: "선생님이 화자를 '꿰뚫어 보는' 순간",
        body: "앞선 507에서 선생님은 이미 화자의 냉소에서 '사랑을 구하면서도 얻지 못한 자'의 목소리를 읽어 냈다. 그 관찰이 여기서 명제화된다 — '자네 마음은 이미 사랑으로 움직이고 있다'.",
      },
      {
        title: "「恋で動いている」",
        body: "「恋」가 주어가 아니라 원인(〜で)으로 쓰여, 사랑이 화자의 마음을 밖에서 흔드는 힘으로 묘사된다. 의지가 아닌 '움직임당함'의 구도.",
      },
    ],
    translations: {
      literal:
        "「어째서인지는 머지않아 알게 됩니다. 머지않아가 아니라 이미 알고 있을 터입니다. 자네의 마음은 진작부터 이미 사랑에 움직이고 있지 않습니까」",
      liberal:
        "「그 까닭은 머잖아 자네 스스로 알게 될 걸세. 아니, 머잖아랄 것도 없이 자네는 이미 알고 있을 것이네. 자네 마음은 벌써 오래전부터 사랑에 흔들리고 있지 않은가 말이야」",
    },
  },
  {
    id: 517,
    paragraph: 13,
    original:
      "私は一応自分の胸の中を調べて見た。けれどもそこは案外に空虚であった。思いあたるようなものは何にもなかった。",
    hiragana: [
      h("わたくし", true), h("は ", false),
      h("いちおう", true), h(" ", false),
      h("じぶん", true), h("の ", false),
      h("むね", true), h("の ", false),
      h("なか", true), h("を ", false),
      h("しら", true), h("べて ", false),
      h("み", true), h("た。けれどもそこは ", false),
      h("あんがい", true), h("に ", false),
      h("くうきょ", true), h("であった。 ", false),
      h("おも", true), h("いあたるようなものは ", false),
      h("なん", true), h("にもなかった。", false),
    ],
    meaning:
      "나는 일단 자신의 가슴속을 살펴보았다. 그렇지만 그곳은 뜻밖에도 텅 비어 있었다. 짚이는 것이라고는 아무것도 없었다.",
    vocab: [
      V("私", "わたくし", "나"),
      V("一応", "いちおう", "일단, 우선"),
      V("自分", "じぶん", "자기"),
      V("胸", "むね", "가슴, 마음속"),
      V("中", "なか", "속, 안"),
      V("調べる", "しらべる", "살펴보다"),
      V("見える", "みる", "보다 (〜て見る 시도)"),
      V("案外", "あんがい", "뜻밖에"),
      V("空虚", "くうきょ", "공허"),
      V("思いあたる", "おもいあたる", "짚이다"),
      V("何", "なに", "아무것도"),
    ],
    grammar: [
      {
        element: "調べて見た",
        desc: "「〜てみる」 시도 표현의 원형. 「見る」를 한자로 보존해, 실제로 '안을 들여다보았다'는 시각적 함의를 남김.",
      },
      { element: "案外に〜", desc: "'뜻밖에, 의외로'. 기대와 실제가 어긋남을 표시하는 부사." },
      { element: "思いあたる", desc: "'짚이다, 불현듯 생각이 미치다'. 검색하듯 훑어도 걸리는 것이 없는 상태." },
    ],
    notes: [
      {
        title: "선생님의 단언에 대한 화자의 자기 검증",
        body: "516 '자네는 이미 사랑에 움직이고 있다'라는 지목을 받고, 화자는 즉시 자기 안을 점검한다. 그런데 '텅 비어 있었다'. 선생님의 통찰과 화자의 자기 인식 사이의 공백이 이 단락의 긴장을 만든다.",
      },
      {
        title: "세 짧은 문장의 가속",
        body: "「調べて見た → 空虚であった → 何にもなかった」 세 마디가 점점 짧아지며 '찾다 → 비어 있음 → 없음'으로 결론을 조여 간다.",
      },
    ],
    translations: {
      literal:
        "나는 일단 자기 가슴속을 살펴보았다. 그렇지만 그곳은 뜻밖에도 공허했다. 짚이는 것이라고는 아무것도 없었다.",
      liberal:
        "나는 일단 내 가슴속을 가만히 들여다보았다. 그러나 그 안은 의외로 텅 비어 있었다. 짚이는 구석이라곤 어느 하나도 없었다.",
    },
  },
  {
    id: 518,
    paragraph: 13,
    original:
      "「私の胸の中にこれという目的物は一つもありません。私は先生に何も隠してはいないつもりです」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("の ", false),
      h("むね", true), h("の ", false),
      h("なか", true), h("にこれという ", false),
      h("もくてきぶつ", true), h("は ", false),
      h("ひと", true), h("つもありません。 ", false),
      h("わたくし", true), h("は ", false),
      h("せんせい", true), h("に ", false),
      h("なに", true), h("も ", false),
      h("かく", true), h("してはいないつもりです」", false),
    ],
    meaning:
      "「제 가슴속에는 이렇다 할 대상은 하나도 없습니다. 저는 선생님께 아무것도 숨기고 있지 않을 셈입니다」",
    vocab: [
      V("私", "わたくし", "나"),
      V("胸", "むね", "가슴, 마음속"),
      V("中", "なか", "속, 안"),
      V("目的物", "もくてきぶつ", "목적물, 사랑의 대상"),
      V("一つ", "ひとつ", "하나"),
      V("先生", "せんせい", "선생"),
      V("何", "なに", "아무것"),
      V("隠す", "かくす", "숨기다"),
      V("つもり", "つもり", "작정, 의도"),
    ],
    grammar: [
      { element: "これという〜", desc: "'이렇다 할, 딱히 이것이라고 할 만한'. 뒤의 부정과 호응해 '이렇다 할 ~은 없다'." },
      { element: "一つもありません", desc: "'하나도 없다'. 수사 + 「も」 + 부정으로 완전부정." },
      {
        element: "隠してはいないつもりです",
        desc: "「〜つもり」 = 본인 인식·의도. '숨기고 있지 않을 생각이다' — 사실보다 '내 의도로는' 이라는 유보를 남김.",
      },
    ],
    notes: [
      {
        title: "「目的物」 — 낯선 명사화",
        body: "사랑의 상대를 「目的物」(목적물)이라 부르는 것은 소세키 특유의 냉철한 명사화. 뜨거운 감정을 차가운 대상명으로 묶어, 화자의 자기 인식이 아직 감정과 분리된 상태임을 암시.",
      },
      {
        title: "「つもり」의 방어",
        body: "화자는 단정하지 못한다. 「隠していない」가 아니라 「隠していないつもりです」 — '내 생각으로는 그렇다'. 뒤이어 선생님이 이 유보를 정확히 찌를 것을 예고.",
      },
    ],
    translations: {
      literal:
        "「내 가슴속에 이렇다 할 목적물은 하나도 없습니다. 나는 선생에게 아무것도 숨기지 않을 셈입니다」",
      liberal:
        "「제 마음속에는 이렇다 할 대상이 단 하나도 없습니다. 선생님께 숨기고 있는 것은 아무것도 없다고, 저는 그렇게 여기고 있습니다」",
    },
  },
  {
    id: 519,
    paragraph: 13,
    original:
      "「目的物がないから動くのです。あれば落ち付けるだろうと思って動きたくなるのです」",
    hiragana: [
      h("「 ", false),
      h("もくてきぶつ", true), h("がないから ", false),
      h("うご", true), h("くのです。あれば ", false),
      h("お", true), h("ち", false),
      h("つ", true), h("けるだろうと ", false),
      h("おも", true), h("って ", false),
      h("うご", true), h("きたくなるのです」", false),
    ],
    meaning:
      "「대상이 없으니까 움직이는 겁니다. 있으면 마음이 가라앉을 거라고 생각해 움직이고 싶어지는 것이지요」",
    vocab: [
      V("目的物", "もくてきぶつ", "목적물, 대상"),
      V("動く", "うごく", "움직이다"),
      V("落ち付く", "おちつく", "가라앉다, 안정되다"),
      V("思う", "おもう", "생각하다"),
    ],
    grammar: [
      {
        element: "〜がないから動く",
        desc: "'~이 없으니까 움직인다'. 516의 역설 — 대상이 '없기에' 찾고자 움직이는 것이 사랑의 초기 징후라는 선생님의 정의.",
      },
      { element: "あれば落ち付ける", desc: "「あれば」가정형 + 「落ち付く」 가능형. '있기만 하면 마음이 가라앉을 수 있다'." },
      { element: "〜たくなる", desc: "희망 조동사 「たい」 + 「なる」. '~하고 싶어지다' — 저절로 그렇게 된다는 수동적 변화." },
    ],
    notes: [
      {
        title: "선생님의 '사랑 = 결핍의 운동' 정의",
        body: "화자가 내세운 '대상이 없다'는 변명을 선생님은 거꾸로 뒤집어 증거로 삼는다. 대상이 없어서 움직이는 것이 바로 사랑 — 운동의 원인을 '결핍'에 둔다.",
      },
      {
        title: "「動く」의 반복",
        body: "516 「動いている」, 519 「動くのです/動きたくなる」. 한 단락 안에서 네 번 쓰이며, '사랑 = 마음의 움직임' 이라는 등식을 리듬으로 각인.",
      },
      {
        title: "상세 텍스트 주석",
        body: "「落ち付ける」는 「落ち着く」와 같은 동사의 다른 표기. 소세키 시대 표기에 따라 「付」를 쓴다 — '자리를 붙이다 = 가라앉다'의 어원적 울림.",
      },
    ],
    translations: {
      literal:
        "「목적물이 없으니까 움직이는 것입니다. 있으면 마음이 가라앉을 것이라 생각해 움직이고 싶어지는 것입니다」",
      liberal:
        "「대상이 없기에 움직이는 것이라네. 대상만 있다면 마음이 가라앉으리라 여기기에, 저절로 움직이고 싶어지는 것이지」",
    },
  },
];

for (const s of sentences) novel.push(s);

// ===== 4. Update novel-paragraphs.json =====
const existing13 = paraMap.paragraphs.find((p) => p.paragraph === 13);
if (existing13) {
  existing13.range = [511, 519];
} else {
  paraMap.paragraphs.push({ paragraph: 13, range: [511, 519] });
}

// ===== Write back =====
writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2) + "\n", "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2) + "\n", "utf8");
writeFileSync(novelParaPath, JSON.stringify(paraMap, null, 2) + "\n", "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocab[lv], null, 2) + "\n", "utf8");
}

console.log("Added paragraph 13 sentences 511-519.");
console.log("New kanji:", Object.keys(newKanji).join(", "));
console.log("New vocab indices:");
for (const [k, v] of Object.entries(idx)) console.log(`  ${k} -> ${v.level}#${v.index}`);
