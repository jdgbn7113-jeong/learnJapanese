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

// ============ NEW KANJI (13) ============
const newKanji = {
  "丈": {
    char: "丈", readings: { onyomi: ["ジョウ"], kunyomi: ["たけ", "だけ"] },
    meanings: ["어른", "키", "길이"], jlpt: "N1", grade: 9, strokes: 3,
    radicals: [{ char: "一", meaning: "하나·선", position: "top" }, { char: "乂", meaning: "손에 막대", position: "bottom" }],
    mnemonic: {
      radicalRoles: [{ char: "一", persona: "머리 위 선" }, { char: "乂", persona: "손에 쥔 지팡이" }],
      story: "머리 위 선(一) 아래 지팡이(乂)를 짚고 선 사람 — 어른의 키, 길이를 재는 단위.",
      keyImage: "지팡이를 짚은 어른의 키",
    },
    examples: [
      { word: "心丈夫", reading: "こころじょうぶ", meaning: "든든함" },
      { word: "丈夫", reading: "じょうぶ", meaning: "튼튼함" },
    ],
  },
  "可": {
    char: "可", readings: { onyomi: ["カ"], kunyomi: ["べ.し"] },
    meanings: ["가능", "옳다"], jlpt: "N3", grade: 5, strokes: 5,
    radicals: [{ char: "丁", meaning: "막대·못", position: "outside" }, { char: "口", meaning: "입", position: "inside" }],
    mnemonic: {
      radicalRoles: [{ char: "丁", persona: "곧은 막대" }, { char: "口", persona: "입의 긍정" }],
      story: "丁(곧은 막대) 옆의 口(입)이 '그래도 좋다'고 허락하는 모양 — 가능, 옳다.",
      keyImage: "허락하는 입 = 가능",
    },
    examples: [
      { word: "可哀そう", reading: "かわいそう", meaning: "가엾음" },
      { word: "可能", reading: "かのう", meaning: "가능" },
    ],
  },
  "哀": {
    char: "哀", readings: { onyomi: ["アイ"], kunyomi: ["あわ.れ", "かな.しい"] },
    meanings: ["슬프다", "가엾다"], jlpt: "N1", grade: 8, strokes: 9,
    radicals: [{ char: "衣", meaning: "옷", position: "outside" }, { char: "口", meaning: "입", position: "middle" }],
    mnemonic: {
      radicalRoles: [{ char: "衣", persona: "옷자락" }, { char: "口", persona: "울음이 새어 나오는 입" }],
      story: "衣(옷자락)에 口(입)을 묻고 우는 모습 — 슬픔, 애처로움.",
      keyImage: "옷자락에 얼굴을 묻고 울다",
    },
    examples: [
      { word: "可哀そう", reading: "かわいそう", meaning: "가엾음" },
      { word: "哀れ", reading: "あわれ", meaning: "애처로움" },
    ],
  },
  "弱": {
    char: "弱", readings: { onyomi: ["ジャク"], kunyomi: ["よわ.い", "よわ.る"] },
    meanings: ["약하다"], jlpt: "N5", grade: 2, strokes: 10,
    radicals: [{ char: "弓", meaning: "활", position: "left+right" }, { char: "冫", meaning: "깃털", position: "inside" }],
    mnemonic: {
      radicalRoles: [{ char: "弓", persona: "활 두 개" }, { char: "冫", persona: "가벼운 깃털" }],
      story: "활(弓) 두 개에 매달린 가벼운 깃털(冫) — 당기면 금방 휘는 연약함 = 약하다.",
      keyImage: "가벼운 깃털이 달린 활 = 약함",
    },
    examples: [
      { word: "弱い", reading: "よわい", meaning: "약하다" },
      { word: "弱点", reading: "じゃくてん", meaning: "약점" },
    ],
  },
  "怒": {
    char: "怒", readings: { onyomi: ["ド", "ヌ"], kunyomi: ["いか.る", "おこ.る"] },
    meanings: ["화내다", "분노"], jlpt: "N4", grade: 8, strokes: 9,
    radicals: [{ char: "奴", meaning: "노예", position: "top" }, { char: "心", meaning: "마음", position: "bottom" }],
    mnemonic: {
      radicalRoles: [{ char: "奴", persona: "억눌린 노예" }, { char: "心", persona: "치밀어 오르는 마음" }],
      story: "奴(억눌린 노예)의 心(마음) — 눌려 온 감정이 터져 나오는 분노.",
      keyImage: "눌려 있던 마음의 폭발 = 분노",
    },
    examples: [
      { word: "怒る", reading: "おこる", meaning: "화내다" },
      { word: "怒気", reading: "どき", meaning: "노기" },
    ],
  },
  "早": {
    char: "早", readings: { onyomi: ["ソウ", "サッ"], kunyomi: ["はや.い", "はや.まる"] },
    meanings: ["이르다", "빠르다"], jlpt: "N5", grade: 1, strokes: 6,
    radicals: [{ char: "日", meaning: "해", position: "top" }, { char: "十", meaning: "열·세움", position: "bottom" }],
    mnemonic: {
      radicalRoles: [{ char: "日", persona: "방금 떠오른 해" }, { char: "十", persona: "곧게 선 막대" }],
      story: "日(해)가 十(곧게) 솟아오른 이른 아침 — '이르다, 빠르다'.",
      keyImage: "막 떠오른 해 = 이른 아침",
    },
    examples: [
      { word: "早い", reading: "はやい", meaning: "이르다, 빠르다" },
      { word: "早朝", reading: "そうちょう", meaning: "이른 아침" },
    ],
  },
  "曲": {
    char: "曲", readings: { onyomi: ["キョク"], kunyomi: ["ま.がる", "ま.げる"] },
    meanings: ["굽다", "곡조"], jlpt: "N4", grade: 3, strokes: 6,
    radicals: [{ char: "曰", meaning: "대나무 바구니 모양", position: "all" }],
    mnemonic: {
      radicalRoles: [{ char: "曰", persona: "굽어 짜인 바구니" }],
      story: "대나무를 굽혀 짜 만든 바구니 모양을 본뜸 — 굽다, 구부러지다.",
      keyImage: "굽어 짜인 대 바구니 = 굽다",
    },
    examples: [
      { word: "曲がる", reading: "まがる", meaning: "굽다, 돌다" },
      { word: "曲り角", reading: "まがりかど", meaning: "길모퉁이" },
    ],
  },
  "移": {
    char: "移", readings: { onyomi: ["イ"], kunyomi: ["うつ.る", "うつ.す"] },
    meanings: ["옮기다", "옮겨지다"], jlpt: "N3", grade: 5, strokes: 11,
    radicals: [{ char: "禾", meaning: "벼", position: "left" }, { char: "多", meaning: "많음", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "禾", persona: "벼" }, { char: "多", persona: "많이 쌓여 넘치는 것" }],
      story: "禾(벼)가 多(많이) 모여 다른 곳으로 옮겨지는 모양 — 이동, 이사.",
      keyImage: "벼를 옮겨 쌓다 = 옮기다",
    },
    examples: [
      { word: "移る", reading: "うつる", meaning: "옮기다, 이동하다" },
      { word: "移動", reading: "いどう", meaning: "이동" },
    ],
  },
  "途": {
    char: "途", readings: { onyomi: ["ト"], kunyomi: ["みち"] },
    meanings: ["길", "도중"], jlpt: "N3", grade: 8, strokes: 10,
    radicals: [{ char: "辶", meaning: "쉬엄쉬엄 갈·길", position: "left" }, { char: "余", meaning: "남다·나", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "辶", persona: "걸어가는 길" }, { char: "余", persona: "아직 남은 여정" }],
      story: "辶(길 위에서) 余(아직 남은 여정)을 걷는 중 — 길, 도중.",
      keyImage: "아직 남은 길 = 도중",
    },
    examples: [
      { word: "途切れる", reading: "とぎれる", meaning: "끊기다" },
      { word: "途中", reading: "とちゅう", meaning: "도중" },
    ],
  },
  "遅": {
    char: "遅", readings: { onyomi: ["チ"], kunyomi: ["おそ.い", "おく.れる"] },
    meanings: ["늦다", "느리다"], jlpt: "N4", grade: 8, strokes: 12,
    radicals: [{ char: "辶", meaning: "길", position: "left" }, { char: "犀", meaning: "코뿔소", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "辶", persona: "길" }, { char: "犀", persona: "느릿느릿한 코뿔소" }],
      story: "辶(길) 위를 犀(코뿔소)가 느릿느릿 걷는다 — 늦다, 느리다.",
      keyImage: "길을 느릿 가는 코뿔소 = 늦다",
    },
    examples: [
      { word: "遅い", reading: "おそい", meaning: "늦다" },
      { word: "遅刻", reading: "ちこく", meaning: "지각" },
    ],
  },
  "配": {
    char: "配", readings: { onyomi: ["ハイ"], kunyomi: ["くば.る"] },
    meanings: ["나누다", "짝짓다"], jlpt: "N3", grade: 3, strokes: 10,
    radicals: [{ char: "酉", meaning: "술항아리", position: "left" }, { char: "己", meaning: "자기", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "酉", persona: "술항아리" }, { char: "己", persona: "짝이 되는 사람" }],
      story: "酉(술항아리) 옆에 己(사람) — 술을 잔마다 나누고 짝지어 돌리는 모양 = 나누다, 배분하다.",
      keyImage: "술을 잔마다 나누다 = 배분",
    },
    examples: [
      { word: "心配", reading: "しんぱい", meaning: "걱정" },
      { word: "配る", reading: "くばる", meaning: "나누어 주다" },
    ],
  },
  "閉": {
    char: "閉", readings: { onyomi: ["ヘイ"], kunyomi: ["と.じる", "し.まる", "と.ざす"] },
    meanings: ["닫다", "막다"], jlpt: "N3", grade: 6, strokes: 11,
    radicals: [{ char: "門", meaning: "문", position: "outside" }, { char: "才", meaning: "빗장", position: "inside" }],
    mnemonic: {
      radicalRoles: [{ char: "門", persona: "문" }, { char: "才", persona: "가로지른 빗장" }],
      story: "門(문)에 才(빗장)을 걸어 — 닫다, 막다.",
      keyImage: "빗장 걸린 문 = 닫다",
    },
    examples: [
      { word: "閉じる", reading: "とじる", meaning: "닫다" },
      { word: "閉店", reading: "へいてん", meaning: "폐점" },
    ],
  },
  "順": {
    char: "順", readings: { onyomi: ["ジュン"], kunyomi: [] },
    meanings: ["순서", "따르다"], jlpt: "N3", grade: 4, strokes: 12,
    radicals: [{ char: "川", meaning: "강물", position: "left" }, { char: "頁", meaning: "머리", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "川", persona: "흐르는 물" }, { char: "頁", persona: "물결에 기울인 머리" }],
      story: "川(물)의 흐름에 頁(머리)를 맡겨 따라가는 모습 — 순서, 순응.",
      keyImage: "흐름에 맡긴 머리 = 순서",
    },
    examples: [
      { word: "順路", reading: "じゅんろ", meaning: "순로, 정해진 길" },
      { word: "順番", reading: "じゅんばん", meaning: "순번" },
    ],
  },
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ============ NEW VOCAB (22) ============
const newVocab = {
  N5: [
    { kana: "はやく", kanji: "早く", meaning: "빨리, 일찍", pos: "부사" },
  ],
  N4: [
    { kana: "しんぱい", kanji: "心配", meaning: "걱정", pos: "명사·する동사" },
    { kana: "きたい", kanji: "期待", meaning: "기대", pos: "명사·する동사" },
    { kana: "うつる", kanji: "移る", meaning: "옮기다, 이동하다", pos: "동사" },
    { kana: "あんがい", kanji: "案外", meaning: "뜻밖, 의외", pos: "부사·な형용사" },
    { kana: "すまない", kanji: "済まない", meaning: "미안하다", pos: "い형용사·관용" },
    { kana: "きがする", kanji: "気がする", meaning: "느낌이 들다", pos: "관용구" },
    { kana: "まがりかど", kanji: "曲り角", meaning: "길모퉁이", pos: "명사" },
  ],
  N3: [
    { kana: "おこる", kanji: "怒る", meaning: "화내다", pos: "동사" },
    { kana: "かわいそう", kanji: "可哀そう", meaning: "가엾다, 불쌍하다", pos: "な형용사" },
    { kana: "たより", kanji: "頼り", meaning: "의지, 기댈 대상", pos: "명사" },
    { kana: "つづき", kanji: "続き", meaning: "계속, 이어짐", pos: "명사" },
    { kana: "とじる", kanji: "閉じる", meaning: "닫다", pos: "동사" },
    { kana: "わかれる", kanji: "分れる", meaning: "헤어지다, 갈라지다 (別れる의 이체)", pos: "동사" },
  ],
  N2: [
    { kana: "ちんもく", kanji: "沈黙", meaning: "침묵", pos: "명사·する동사" },
    { kana: "とぎれる", kanji: "途切れる", meaning: "끊기다", pos: "동사" },
    { kana: "こっけい", kanji: "滑稽", meaning: "골계, 우스꽝스러움", pos: "な형용사" },
    { kana: "むごん", kanji: "無言", meaning: "무언, 말없음", pos: "명사" },
    { kana: "じゅんろ", kanji: "順路", meaning: "순로, 정해진 길", pos: "명사" },
  ],
  N1: [
    { kana: "こころじょうぶ", kanji: "心丈夫", meaning: "든든함", pos: "な형용사" },
    { kana: "ちゅうぐらい", kanji: "中位", meaning: "중간 정도", pos: "명사·부사" },
    { kana: "さいくん", kanji: "妻君", meaning: "아내 (격식·옛 표현)", pos: "명사" },
  ],
};
for (const [lv, words] of Object.entries(newVocab)) {
  const arr = vocabFiles[lv].words;
  for (const w of words) arr.push(w);
}

// Build vocab index (including newly added)
const vIdx = new Map();
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  vocabFiles[lv].words.forEach((w, i) => {
    const key = `${w.kanji ?? w.kana}|${w.kana}`;
    if (!vIdx.has(key)) vIdx.set(key, { level: lv, index: i });
  });
}
function vref(k, r) { return vIdx.get(`${k}|${r}`); }
function mv(items) {
  return items.map(([k, r, m]) => {
    const ref = vref(k, r);
    return ref ? { kanji: k, reading: r, meaning: m, ref } : { kanji: k, reading: r, meaning: m };
  });
}
function hira(parts) { return parts.map(([t, e]) => ({ t, e: !!e })); }

// ============ NEW NOVEL ENTRIES (12) ============
const newEntries = [
  {
    id: 399, paragraph: 10,
    original: "二人が帰るとき歩きながらの沈黙が一丁も二丁もつづいた。",
    hiragana: hira([
      ["ふたり", 1], ["が ", 0],
      ["かえ", 1], ["るとき ", 0],
      ["ある", 1], ["きながらの ", 0],
      ["ちんもく", 1], ["が ", 0],
      ["いっちょう", 1], ["も ", 0],
      ["にちょう", 1], ["もつづいた。", 0],
    ]),
    meaning: "두 사람이 돌아갈 때, 걸으면서 이어진 침묵이 한 블록도, 두 블록도 계속되었다.",
    vocab: mv([
      ["二人", "ふたり", "두 사람"],
      ["帰る", "かえる", "돌아가다"],
      ["歩く", "あるく", "걷다"],
      ["沈黙", "ちんもく", "침묵"],
      ["一丁", "いっちょう", "한 정(距離 단위, 약 109m)"],
      ["二丁", "にちょう", "두 정"],
    ]),
    grammar: [
      { element: "帰るとき歩きながらの沈黙", desc: "「帰るとき」(돌아갈 때) + 「歩きながら」(걸으면서) + 「の沈黙」. 여러 수식어가 「沈黙」 하나에 걸려 그 침묵의 상황을 정교하게 좁혀 놓는다." },
      { element: "一丁も二丁もつづいた", desc: "「A도 B도」 + 「つづく」의 과거. 거리 단위를 반복해 '몇 블록이나 계속'되었다는 길이를 강조." },
    ],
    notes: [
      { title: "「一丁・二丁」의 거리감", body: "「丁(ちょう)」는 약 109m의 메이지식 거리 단위. '한 정, 두 정'이라고 반복함으로써 시간을 분 단위가 아닌 '걸어도 걸어도 이어지는 공간'으로 표현. 침묵의 밀도를 공간의 길이로 번역하는 소세키 특유의 수법." },
      { title: "9단락 끝의 여운", body: "9단락이 '선생님의 고통은 내가 상상할 수 없다'(398)로 끝난 직후, 10단락은 두 사람의 공유된 침묵으로 시작. 말로 닿지 못한 거리가 이어지는 걸음과 말없음으로 번역되어 장면을 연다." },
    ],
  },
  {
    id: 400, paragraph: 10,
    original: "その後で突然先生が口を利き出した。",
    hiragana: hira([
      ["そのあと", 1], ["で ", 0],
      ["とつぜん", 1], [" ", 0],
      ["せんせい", 1], ["が ", 0],
      ["くち", 1], ["を ", 0],
      ["き", 1], ["き ", 0],
      ["だ", 1], ["した。", 0],
    ]),
    meaning: "그 후 갑자기 선생님이 입을 열었다.",
    vocab: mv([
      ["後", "あと", "후, 뒤"],
      ["突然", "とつぜん", "갑자기"],
      ["先生", "せんせい", "선생님"],
      ["口を利く", "くちをきく", "말을 하다 (관용)"],
    ]),
    grammar: [
      { element: "その後で", desc: "'그 후에'. 직전의 긴 침묵과 대비시키는 시간 지표." },
      { element: "突然", desc: "부사. '갑자기'. 예고 없이 말이 터져 나왔음을 강조." },
      { element: "口を利き出した", desc: "「口を利く」(말을 하다) 관용 + 「〜出す」(시작하다)의 과거. '말을 꺼내기 시작했다'." },
    ],
    notes: [
      { title: "「口を利く」의 관용성", body: "직역하면 '입을 쓰다'. 「話す」보다 미묘하게 '침묵을 깨고 입을 움직이기 시작한다'는 이미지를 담는다. 앞 문장(399)의 두터운 침묵을 배경으로 이 관용구가 자기 자리를 찾는다." },
      { title: "「突然」의 위치", body: "'갑자기'가 문두에 오면서 독자도 화자처럼 예상치 못한 발화를 맞이한다. 이 한 단어가 다음 문장(401)의 선생님 고백 전체의 무게를 선행한다." },
    ],
  },
  {
    id: 401, paragraph: 10,
    original: "「悪い事をした。怒って出たから妻はさぞ心配をしているだろう。考えると女は可哀そうなものですね。私の妻などは私より外にまるで頼りにするものがないんだから」",
    hiragana: hira([
      ["「", 0], ["わる", 1], ["い ", 0],
      ["こと", 1], ["をした。 ", 0],
      ["おこ", 1], ["って ", 0],
      ["で", 1], ["たから ", 0],
      ["さい", 1], ["はさぞ ", 0],
      ["しんぱい", 1], ["をしているだろう。 ", 0],
      ["かんが", 1], ["えると ", 0],
      ["おんな", 1], ["は ", 0],
      ["かわい", 1], ["そうなものですね。 ", 0],
      ["わたくし", 1], ["の ", 0],
      ["さい", 1], ["などは ", 0],
      ["わたくし", 1], ["より ", 0],
      ["ほか", 1], ["にまるで ", 0],
      ["たよ", 1], ["りにするものがないんだから」", 0],
    ]),
    meaning: "\"못난 짓을 했어요. 화를 내고 집을 나왔으니 아내는 분명 걱정하고 있을 겁니다. 생각해 보면 여자는 가엾은 존재지요. 내 아내 같은 사람은 나 말고는 아예 의지할 대상이 없으니 말입니다\"",
    vocab: mv([
      ["悪い", "わるい", "나쁘다"],
      ["事", "こと", "일"],
      ["怒る", "おこる", "화내다"],
      ["出る", "でる", "나가다"],
      ["妻", "さい", "아내 (격식체)"],
      ["心配", "しんぱい", "걱정"],
      ["考える", "かんがえる", "생각하다"],
      ["女", "おんな", "여자"],
      ["可哀そう", "かわいそう", "가엾다"],
      ["私", "わたくし", "나"],
      ["外", "ほか", "그 밖"],
      ["頼り", "たより", "의지"],
    ]),
    grammar: [
      { element: "怒って出たから", desc: "「怒る」의 て형 + 「出る」의 과거 + 「から」(이유). '화를 내고 나왔기 때문에'. 자신의 행동을 원인으로 인정." },
      { element: "さぞ〜だろう", desc: "「さぞ」(필시) + 추량 「だろう」. '분명 〜하고 있을 것이다'. 상대의 감정을 멀리서 헤아리는 추측." },
      { element: "考えると", desc: "'생각해 보면'. 자기 행위에서 한 발 떨어져 일반론으로 넘어가는 전환 표지." },
      { element: "私より外に〜ないんだから", desc: "「〜より外に」(~말고는) + 「ない」 + 「んだから」(이유·강조). '나 말고는 전혀 없으니까'. 아내의 고립을 자기 책임으로 연결." },
    ],
    notes: [
      { title: "자기 인정에서 일반론으로, 다시 아내로", body: "세 단계로 움직이는 자기 서술 — 「悪い事をした」(자기 인정) → 「女は可哀そうなものですね」(일반론) → 「私の妻などは私より外に…」(자기 아내로 회귀). 구체에서 일반을 거쳐 다시 구체로 돌아오는 사유의 곡선." },
      { title: "「可哀そうなもの」의 거리", body: "사람을 「もの」로 받는 문어체. 아내를 동정하는 감정을 표하면서도 그 대상을 대상화하는 이중성. 9단락의 '감정의 객관화'(392 「下らない神経を昂奮させてしまった」)와 톤이 이어진다." },
      { title: "의지처로서의 자기 인식", body: "'내 아내는 나 말고는 기댈 대가 없다'는 자각. 이것이 선생님이 아내에게 붙잡혀 있는 윤리적 무게이자, 뒤따르는 자기 정체성의 질문(403 「強い人に見えますか」)으로 이어지는 사고의 씨앗." },
    ],
  },
  {
    id: 402, paragraph: 10,
    original: "先生の言葉はちょっとそこで途切れたが、別に私の返事を期待する様子もなく、すぐその続きへ移って行った。",
    hiragana: hira([
      ["せんせい", 1], ["の ", 0],
      ["ことば", 1], ["はちょっとそこで ", 0],
      ["とぎ", 1], ["れたが、 ", 0],
      ["べつ", 1], ["に ", 0],
      ["わたくし", 1], ["の ", 0],
      ["へんじ", 1], ["を ", 0],
      ["きたい", 1], ["する ", 0],
      ["ようす", 1], ["もなく、すぐその ", 0],
      ["つづ", 1], ["きへ ", 0],
      ["うつ", 1], ["って ", 0],
      ["い", 1], ["った。", 0],
    ]),
    meaning: "선생님의 말은 잠깐 거기서 끊겼지만, 특별히 내 대답을 기대하는 기색도 없이, 곧바로 그 다음 말로 옮겨 갔다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["言葉", "ことば", "말"],
      ["途切れる", "とぎれる", "끊기다"],
      ["別に", "べつに", "특별히 (부정 수반)"],
      ["私", "わたくし", "나"],
      ["返事", "へんじ", "대답"],
      ["期待", "きたい", "기대"],
      ["様子", "ようす", "기색, 모습"],
      ["続き", "つづき", "계속, 이어짐"],
      ["移る", "うつる", "옮겨 가다"],
      ["行く", "いく", "가다"],
    ]),
    grammar: [
      { element: "ちょっとそこで途切れたが", desc: "「ちょっと」(잠깐) + 「そこで」(거기서) + 「途切れる」의 과거 + 「が」(역접). 말이 한 박자 쉬었다가 다시 이어지는 리듬." },
      { element: "別に〜もなく", desc: "「別に」(특별히) + 「ない」 호응. '특별히 〜도 없이'. 기대의 부재를 덤덤히 기술." },
      { element: "その続きへ移って行った", desc: "「続きへ」(이어짐으로) + 「移る」의 て형 + 「行く」의 과거. '그 다음으로 옮겨 갔다'. 연속 동작의 방향성." },
    ],
    notes: [
      { title: "대화가 아닌 독백의 흐름", body: "선생님은 대답을 기다리지 않고 자기 말의 흐름을 이어 간다. 화자가 대답할 자리가 없는 상태 — 이는 9단락 391 「何の答えもし得なかった」의 침묵과 대응하지만, 여기선 침묵이 아니라 '말할 틈이 주어지지 않음'이 된다." },
      { title: "「別に」의 온도", body: "'별로' 기대하지 않았다는 말이 냉담하기보다 담담한 어조. 선생님이 화자를 대화 상대가 아닌, 자기 내면을 풀어놓을 '곁에 있어 주는 사람'으로 대하고 있음을 보여 준다." },
    ],
  },
  {
    id: 403, paragraph: 10,
    original: "「そういうと、夫の方はいかにも心丈夫のようで少し滑稽だが。君、私は君の眼にどう映りますかね。強い人に見えますか、弱い人に見えますか」",
    hiragana: hira([
      ["「そういうと、 ", 0],
      ["おっと", 1], ["の ", 0],
      ["ほう", 1], ["はいかにも ", 0],
      ["こころじょうぶ", 1], ["のようで ", 0],
      ["すこ", 1], ["し ", 0],
      ["こっけい", 1], ["だが。 ", 0],
      ["きみ", 1], ["、 ", 0],
      ["わたくし", 1], ["は ", 0],
      ["きみ", 1], ["の ", 0],
      ["め", 1], ["にどう ", 0],
      ["うつ", 1], ["りますかね。 ", 0],
      ["つよ", 1], ["い ", 0],
      ["ひと", 1], ["に ", 0],
      ["み", 1], ["えますか、 ", 0],
      ["よわ", 1], ["い ", 0],
      ["ひと", 1], ["に ", 0],
      ["み", 1], ["えますか」", 0],
    ]),
    meaning: "\"그렇게 말하고 나면, 남편 쪽은 아주 든든해 보여서 좀 우스꽝스럽지만요. 자네, 나는 자네 눈에 어떻게 비칩니까. 강한 사람으로 보입니까, 약한 사람으로 보입니까\"",
    vocab: mv([
      ["夫", "おっと", "남편"],
      ["方", "ほう", "쪽"],
      ["心丈夫", "こころじょうぶ", "든든함"],
      ["少し", "すこし", "조금"],
      ["滑稽", "こっけい", "우스꽝스러움"],
      ["君", "きみ", "자네"],
      ["私", "わたくし", "나"],
      ["眼", "め", "눈"],
      ["映る", "うつる", "비치다"],
      ["強い", "つよい", "강하다"],
      ["人", "ひと", "사람"],
      ["見える", "みえる", "보이다"],
      ["弱い", "よわい", "약하다"],
    ]),
    grammar: [
      { element: "そういうと", desc: "'그렇게 말하면, 그렇게 말하고 나면'. 직전 401번의 자기 발화를 자기가 되짚어 보는 전환." },
      { element: "いかにも〜のようで", desc: "「いかにも」(아주, 실로) + 「〜のようで」(~처럼 보여서). '정말로 〜한 듯이'. 외관과 속내의 어긋남을 지시." },
      { element: "どう映りますかね", desc: "「どう」(어떻게) + 「映る」(비치다) + 「か」 + 「ね」. '어떻게 보입니까'. 「ね」가 확답을 강요하지 않는 부드러운 청유." },
      { element: "強い人に見えますか、弱い人に見えますか", desc: "두 의문을 병렬. 「A に見える」 = 'A로 보이다'. 양 극단을 모두 제시해 답자의 선택을 유도." },
    ],
    notes: [
      { title: "자기 외관의 자의식", body: "'아내에게 의지처'라고 말한 직후, 그 말이 자기 외관을 과장해 놓았음을 스스로 지적 — 「少し滑稽だが」. 자기 발화를 즉시 되짚는 메타적 자의식이 선생님 특유의 목소리를 만든다." },
      { title: "타인의 눈에 비친 자기", body: "선생님이 화자에게 '나는 어떻게 보이는가'를 직접 묻는 첫 장면. 9단락 390 「君に分りますか」가 '내 내면을 이해하는가'였다면, 이 403은 '내 외관이 어떻게 보이는가' — 안에서 밖으로 질문의 초점이 옮겨 간다." },
      { title: "이분법의 유도", body: "'강한 사람 / 약한 사람'이라는 두 극단만 제시. 다음 문장 404의 「中位」라는 절묘한 답은 이 이분법을 거스르는 대응 — 선생님의 이분법 자체가 깨지는 순간으로 이어진다." },
    ],
  },
  {
    id: 404, paragraph: 10,
    original: "「中位に見えます」と私は答えた。この答えは先生にとって少し案外らしかった。",
    hiragana: hira([
      ["「", 0], ["ちゅうぐらい", 1], ["に ", 0],
      ["み", 1], ["えます」と ", 0],
      ["わたくし", 1], ["は ", 0],
      ["こた", 1], ["えた。この ", 0],
      ["こた", 1], ["えは ", 0],
      ["せんせい", 1], ["にとって ", 0],
      ["すこ", 1], ["し ", 0],
      ["あんがい", 1], ["らしかった。", 0],
    ]),
    meaning: "\"중간쯤으로 보입니다\"라고 나는 대답했다. 이 대답은 선생님에게 있어 조금 뜻밖인 듯했다.",
    vocab: mv([
      ["中位", "ちゅうぐらい", "중간 정도"],
      ["見える", "みえる", "보이다"],
      ["私", "わたくし", "나"],
      ["答える", "こたえる", "대답하다"],
      ["答え", "こたえ", "대답"],
      ["先生", "せんせい", "선생님"],
      ["少し", "すこし", "조금"],
      ["案外", "あんがい", "뜻밖, 의외"],
    ]),
    grammar: [
      { element: "中位に見えます", desc: "「中位(ちゅうぐらい)」 + 「に見える」. 이분법을 거부하고 중간을 택한 답. 정중체 「ます」의 담담함이 답의 가벼움을 보조." },
      { element: "〜にとって", desc: "'〜에게 있어'. 주관적 평가의 주체를 명시." },
      { element: "案外らしかった", desc: "「案外」(의외) + 「らしい」의 과거. '의외인 듯했다'. 화자가 선생님의 반응을 추측의 형태로 묘사." },
    ],
    notes: [
      { title: "이분법을 거부하는 답", body: "선생님은 '강함/약함' 두 선택지를 내놓았지만 화자는 제 3의 답 「中位」로 빠져나간다. 답변 자체가 선생님의 이분법을 느슨하게 풀어 버리는 행위." },
      { title: "「案外らしかった」의 이중 추측", body: "「案外」(의외) + 「らしい」(인 듯). 이중의 추측 표현 — 화자가 선생님의 놀람조차 확언하지 못하고 추정한다. 9단락 398 「想像の及ばない」와 이어지는, '상대의 내면에 닿지 못하는' 거리의 연장." },
    ],
  },
  {
    id: 405, paragraph: 10,
    original: "先生はまた口を閉じて、無言で歩き出した。",
    hiragana: hira([
      ["せんせい", 1], ["はまた ", 0],
      ["くち", 1], ["を ", 0],
      ["と", 1], ["じて、 ", 0],
      ["むごん", 1], ["で ", 0],
      ["ある", 1], ["き ", 0],
      ["だ", 1], ["した。", 0],
    ]),
    meaning: "선생님은 다시 입을 다물고, 말없이 걷기 시작했다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["口", "くち", "입"],
      ["閉じる", "とじる", "닫다"],
      ["無言", "むごん", "무언, 말없음"],
      ["歩き出す", "あるきだす", "걷기 시작하다"],
    ]),
    grammar: [
      { element: "また口を閉じて", desc: "「また」(다시) + 「口を閉じる」의 て형. 400번에서 '口を利き出した' 했던 입이 405번에서 다시 닫히는 수미상관." },
      { element: "無言で歩き出した", desc: "「無言で」(말없이) + 「歩き出す」의 과거. '말없이 걷기 시작했다'. 침묵의 재개를 동작으로 확정." },
    ],
    notes: [
      { title: "입의 열고 닫기", body: "400 「口を利き出した」 → 401~403 선생님의 독백 → 404 화자의 「中位」 → 405 「また口を閉じて」. 한 단락 안에 입이 열리고 닫히는 완결된 호흡. 화자의 「中位」가 선생님의 말을 다시 멎게 했다." },
      { title: "「無言で」의 재침묵", body: "단락 처음(399)과 끝(405)이 모두 침묵으로 수미상관. 그러나 같은 침묵이 아니다 — 399의 침묵은 '아직 말하지 않음', 405의 침묵은 '이미 말하고 나서의 재침묵'. 같은 걸음 속에 다른 무게의 침묵이 겹친다." },
    ],
  },
  {
    id: 406, paragraph: 10,
    original: "先生の宅へ帰るには私の下宿のつい傍を通るのが順路であった。",
    hiragana: hira([
      ["せんせい", 1], ["の ", 0],
      ["たく", 1], ["へ ", 0],
      ["かえ", 1], ["るには ", 0],
      ["わたくし", 1], ["の ", 0],
      ["げしゅく", 1], ["のつい ", 0],
      ["そば", 1], ["を ", 0],
      ["とお", 1], ["るのが ", 0],
      ["じゅんろ", 1], ["であった。", 0],
    ]),
    meaning: "선생님의 댁으로 돌아가려면 내 하숙집 바로 옆을 지나는 것이 정상적인 길이었다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["宅", "たく", "댁, 집"],
      ["帰る", "かえる", "돌아가다"],
      ["私", "わたくし", "나"],
      ["下宿", "げしゅく", "하숙"],
      ["傍", "そば", "옆"],
      ["通る", "とおる", "지나가다"],
      ["順路", "じゅんろ", "정해진 길"],
    ]),
    grammar: [
      { element: "帰るには〜のが順路であった", desc: "「〜には」(~하려면) + 「〜のが順路」(~하는 것이 정상 노선). '~하려면 ~하는 것이 순로였다'. 지리적 사실의 서술." },
      { element: "つい傍", desc: "「つい」(바로) + 「傍(そば)」. '바로 근처'. 「つい」가 거리의 가까움을 강조하며 다음 장면의 '같이 가자' 제안의 복선이 된다." },
    ],
    notes: [
      { title: "공간의 설명으로 장면을 준비", body: "대화에서 지리적 서술로 한 걸음 물러나 장면을 재배치. 독자에게 '지금 두 사람이 어디를 걷고 있는가'를 알려 주며 다음 선택(407~410)의 무대를 마련." },
      { title: "「つい傍」의 복선", body: "'바로 옆'이라는 근접성이 407 '거기서 헤어지기가 미안하다'는 감정으로 이어지고, 409 '댁 앞까지 모시겠다'는 제안의 지리적 조건이 된다." },
    ],
  },
  {
    id: 407, paragraph: 10,
    original: "私はそこまで来て、曲り角で分れるのが先生に済まないような気がした。",
    hiragana: hira([
      ["わたくし", 1], ["はそこまで ", 0],
      ["き", 1], ["て、 ", 0],
      ["まがりかど", 1], ["で ", 0],
      ["わか", 1], ["れるのが ", 0],
      ["せんせい", 1], ["に ", 0],
      ["す", 1], ["まないような ", 0],
      ["き", 1], ["がした。", 0],
    ]),
    meaning: "나는 거기까지 와서, 길모퉁이에서 헤어지는 것이 선생님에게 미안한 듯한 느낌이 들었다.",
    vocab: mv([
      ["私", "わたくし", "나"],
      ["来る", "くる", "오다"],
      ["曲り角", "まがりかど", "길모퉁이"],
      ["分れる", "わかれる", "헤어지다"],
      ["先生", "せんせい", "선생님"],
      ["済まない", "すまない", "미안하다"],
      ["気がする", "きがする", "느낌이 들다"],
    ]),
    grammar: [
      { element: "分れるのが先生に済まない", desc: "「分れる」(헤어지다)의 명사화 + 「に済まない」(~에게 미안하다). '헤어지는 것이 선생님에게 미안하다'. 주어가 감정의 대상이 아니라 '행위'인 구조." },
      { element: "〜ような気がした", desc: "「ような」(~같은) + 「気がする」의 과거. 이중 완충 — 확신 아닌 느낌, 그마저도 '같은'으로 한 번 더 거리화." },
    ],
    notes: [
      { title: "감정의 삼중 완충", body: "'미안하다' → '미안한 것 같다' → '미안한 것 같은 느낌이 들었다'. 화자가 자기 감정을 세 겹으로 감싸 표현. 선생님과 같은 격식체 거리감이 화자에게도 스며들고 있음을 드러낸다." },
      { title: "거리의 긴장", body: "400 선생님의 먼저 말 꺼냄 → 405 재침묵 → 406 지리적 준비 → 407 화자의 '헤어지기 미안함'. 화자가 선생님 쪽으로 한 걸음 더 다가가려는 순간의 내적 울림." },
    ],
  },
  {
    id: 408, paragraph: 10,
    original: "「ついでにお宅の前までお伴しましょうか」といった。",
    hiragana: hira([
      ["「ついでに ", 0],
      ["おたく", 1], ["の ", 0],
      ["まえ", 1], ["まで ", 0],
      ["おとも", 1], ["しましょうか」と ", 0],
      ["い", 1], ["った。", 0],
    ]),
    meaning: "\"이왕이면 댁 앞까지 모셔다 드릴까요\"라고 말했다.",
    vocab: mv([
      ["お宅", "おたく", "댁"],
      ["前", "まえ", "앞"],
      ["お伴", "おとも", "수행, 모심"],
    ]),
    grammar: [
      { element: "ついでに", desc: "'이왕이면, 하는 김에'. 자연스러운 구실을 만드는 부사. 적극적 제안의 부담을 덜어낸다." },
      { element: "お伴しましょうか", desc: "「お伴(おとも)する」의 겸양형 + 의지·의문 「ましょうか」. '모셔다 드릴까요'. 상대를 높이면서 제안." },
    ],
    notes: [
      { title: "「ついでに」의 조심스러움", body: "적극적인 제안을 '이왕이면'이라는 구실로 감싼다. 407번의 '미안함'을 행동으로 옮기면서도 부담을 주지 않으려는 화자의 배려." },
      { title: "「お伴」의 겸양", body: "'함께 간다'가 아닌 '모시고 간다'. 대등한 동행이 아닌, 자기를 한 단계 내려 선생님을 따르는 자세. 이 정중함이 다음 문장(409) 선생님의 '손으로 막는' 제스처를 더 결정적으로 만든다." },
    ],
  },
  {
    id: 409, paragraph: 10,
    original: "先生は忽ち手で私を遮った。",
    hiragana: hira([
      ["せんせい", 1], ["は ", 0],
      ["たちま", 1], ["ち ", 0],
      ["て", 1], ["で ", 0],
      ["わたくし", 1], ["を ", 0],
      ["さえぎ", 1], ["った。", 0],
    ]),
    meaning: "선생님은 곧바로 손으로 나를 막았다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["忽ち", "たちまち", "곧바로, 순식간에"],
      ["手", "て", "손"],
      ["私", "わたくし", "나"],
      ["遮る", "さえぎる", "막다, 가로막다"],
    ]),
    grammar: [
      { element: "忽ち", desc: "부사. '순식간에, 즉각'. 사이를 두지 않는 빠른 반응." },
      { element: "手で〜を遮った", desc: "「手で」(손으로) + 「遮る」의 과거. '손으로 막았다'. 말이 아닌 신체 동작의 거부." },
    ],
    notes: [
      { title: "말 없는 거부", body: "408번 화자의 정중한 제안에 대한 응답이 말이 아닌 손짓. 9단락 396 「答えようとはしなかった」의 언어적 거부가 여기선 신체적 차단으로 번역된다. 같은 거부가 다른 채널로." },
      { title: "「忽ち」의 속도", body: "'순식간에'. 망설임 없는 즉각성이 결정적. 제안의 내용을 곱씹지 않고 반사적으로 막아 낸다 — 이미 여러 번 이런 경계를 지켜 온 사람의 몸짓임을 암시." },
    ],
  },
  {
    id: 410, paragraph: 10,
    original: "「もう遅いから早く帰りたまえ。私も早く帰ってやるんだから、妻君のために」",
    hiragana: hira([
      ["「もう ", 0],
      ["おそ", 1], ["いから ", 0],
      ["はや", 1], ["く ", 0],
      ["かえ", 1], ["りたまえ。 ", 0],
      ["わたくし", 1], ["も ", 0],
      ["はや", 1], ["く ", 0],
      ["かえ", 1], ["ってやるんだから、 ", 0],
      ["さいくん", 1], ["のために」", 0],
    ]),
    meaning: "\"벌써 늦었으니 빨리 돌아가게. 나도 얼른 돌아가 줄 테니까, 아내를 위해서\"",
    vocab: mv([
      ["遅い", "おそい", "늦다"],
      ["早く", "はやく", "빨리, 일찍"],
      ["帰る", "かえる", "돌아가다"],
      ["私", "わたくし", "나"],
      ["妻君", "さいくん", "아내 (격식·옛 표현)"],
    ]),
    grammar: [
      { element: "帰りたまえ", desc: "「帰る」의 명령형 「〜たまえ」. 옛 남성 상위자가 아랫사람에게 쓰는 부드러운 명령. 메이지 지식인 특유의 말투." },
      { element: "帰ってやる", desc: "「帰る」의 て형 + 「やる」. '(아내를 위해) 돌아가 주다'. 베풀어 주는 행위로의 자기 위치화 — 자조적 울림." },
      { element: "妻君のために", desc: "「妻君(さいくん)」은 아내의 높임 옛말. '아내를 위해서'. 문장 끝에 덧붙여 자기 귀가의 이유를 분명히 한다." },
    ],
    notes: [
      { title: "두 개의 「早く」", body: "'빨리 자네도 돌아가게 / 나도 빨리 돌아가겠네'. 같은 부사의 반복이 두 사람의 귀가를 동기화. 여기서 선생님은 자기 귀가와 화자의 귀가를 같은 시간 축에 놓으며 대등한 위로를 건넨다." },
      { title: "「妻君のために」의 마무리", body: "단락을 닫는 것은 401번에서 열렸던 '아내' 화제. 처음 '아내가 걱정하고 있을 것'으로 시작한 10단락이 '아내를 위해서'로 닫힌다. 선생님의 세계에서 아내가 차지하는 중력이 단락의 수미상관으로 드러나는 마지막 한 마디." },
      { title: "「妻君(さいくん)」의 격식", body: "「妻(さい)」(392, 401)에 존칭 「君」을 더한 형태. 자기 아내를 제3자 앞에서 격식 있게 부르는 메이지 남성 화법. 앞서 「妻」만으로 부르던 어조에서 한 단계 정중한 호칭으로 마무리하는 감정의 무게." },
    ],
  },
];

// Append entries
const existingIds = new Set(novel.map((it) => it.id));
let added = 0;
for (const e of newEntries) {
  if (existingIds.has(e.id)) { console.warn(`Skip: ${e.id} exists`); continue; }
  novel.push(e); added++;
}
novel.sort((a, b) => a.id - b.id);

// Add paragraph 10 to map
const existing10 = paraMap.paragraphs.find((p) => p.paragraph === 10);
if (existing10) {
  existing10.range[1] = Math.max(existing10.range[1], 410);
} else {
  paraMap.paragraphs.push({ paragraph: 10, range: [399, 410] });
  paraMap.paragraphs.sort((a, b) => a.paragraph - b.paragraph);
}

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
}
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Added ${added} novel entries (399-${399 + added - 1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji`);
let vs = 0;
for (const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added ${vs} vocab entries`);
const p10 = paraMap.paragraphs.find((p) => p.paragraph === 10);
console.log(`✓ Paragraph 10 range: [${p10.range[0]}, ${p10.range[1]}]`);
