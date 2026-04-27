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
  "点": nk("点", ["テン"], ["と-ぼす", "つ-く"], ["점", "점수"], "N4", 2, 9,
    [["占", "점 치다·차지하다", "top"], ["灬", "불", "bottom"]],
    "占(점 치듯) 콕 찍은 자리에 灬(불)을 밝힌 모양 — 점, 불 켜기.",
    "콕 찍은 자리에 켠 불 = 점",
    [{ word: "点", reading: "てん", meaning: "점" }, { word: "点じる", reading: "てんじる", meaning: "점을 찍다, 점점 흩뜨리다" }]),
  "椿": nk("椿", ["チン"], ["つばき"], ["동백나무"], "N2", 0, 13,
    [["木", "나무", "left"], ["春", "봄", "right"]],
    "木(나무) + 春(봄) — 이른 봄에 붉게 피는 나무 = 동백.",
    "봄에 피는 나무 = 동백",
    [{ word: "椿", reading: "つばき", meaning: "동백꽃" }]),
  "魚": nk("魚", ["ギョ"], ["さかな", "うお"], ["물고기"], "N5", 2, 11,
    [["⺈", "머리", "top"], ["田", "몸통", "middle"], ["灬", "꼬리(네 점)", "bottom"]],
    "물고기의 머리·몸통·꼬리를 그대로 본뜬 상형 — 물고기.",
    "물고기 모양 = 魚",
    [{ word: "金魚", reading: "きんぎょ", meaning: "금붕어" }, { word: "魚", reading: "さかな", meaning: "물고기" }]),
  "売": nk("売", ["バイ"], ["う-る"], ["팔다"], "N5", 2, 7,
    [["士", "선비·물건 내놓음", "top"], ["冖", "덮개", "middle"], ["儿", "사람", "bottom"]],
    "士(물건을 내놓아) 冖(덮개 내린 가판 앞에서) 儿(사람)이 사고파는 모양 — 팔다.",
    "가판 앞 사람 = 팔다",
    [{ word: "売る", reading: "うる", meaning: "팔다" }, { word: "売り", reading: "うり", meaning: "파는 행위·장수" }]),
  "針": nk("針", ["シン"], ["はり"], ["바늘"], "N3", 6, 10,
    [["金", "쇠", "left"], ["十", "뾰족한 십자", "right"]],
    "金(쇠)으로 十(뾰족하게) 만든 것 = 바늘.",
    "뾰족한 쇠 = 바늘",
    [{ word: "針", reading: "はり", meaning: "바늘" }, { word: "針仕事", reading: "はりしごと", meaning: "바느질" }]),
  "接": nk("接", ["セツ"], ["つ-ぐ"], ["잇다", "닿다"], "N3", 5, 11,
    [["扌", "손(재방변)", "left"], ["妾", "나란히 선 여인", "right"]],
    "扌(손)으로 妾(나란히)에게 닿아 이어 줌 — 접촉, 이음.",
    "손으로 이어 붙임 = 접(接)",
    [{ word: "直接", reading: "ちょくせつ", meaning: "직접" }, { word: "接する", reading: "せっする", meaning: "접하다" }]),
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ===== 2. Vocab =====
const newVocab = {
  N5: [
    { kana: "じゃ", kanji: "じゃ", meaning: "그럼, 그렇다면", pos: "접속사" },
  ],
  N4: [
    { kana: "おれる", kanji: "折れる", meaning: "꺾이다, 부러지다", pos: "동사" },
  ],
  N3: [
    { kana: "くせ", kanji: "癖", meaning: "버릇", pos: "명사" },
    { kana: "ぜんたい", kanji: "全体", meaning: "전체", pos: "명사" },
    { kana: "きんぎょ", kanji: "金魚", meaning: "금붕어", pos: "명사" },
    { kana: "うり", kanji: "売り", meaning: "파는 행위, 장수", pos: "명사" },
    { kana: "おおどおり", kanji: "大通り", meaning: "큰길, 대로", pos: "명사" },
    { kana: "こむ", kanji: "込む", meaning: "속까지 들어가다, 붐비다", pos: "동사" },
    { kana: "ひっそり", kanji: "ひっそり", meaning: "조용히", pos: "부사" },
    { kana: "はり", kanji: "針", meaning: "바늘", pos: "명사" },
    { kana: "ちょくせつ", kanji: "直接", meaning: "직접", pos: "명사·부사" },
  ],
  N2: [
    { kana: "ぽたぽた", kanji: "ぽたぽた", meaning: "뚝뚝, 방울방울", pos: "부사" },
    { kana: "こうじ", kanji: "小路", meaning: "골목, 작은 길", pos: "명사" },
    { kana: "ぞんがい", kanji: "存外", meaning: "뜻밖에", pos: "부사·な형용사" },
    { kana: "いつものとおり", kanji: "いつもの通り", meaning: "여느 때처럼", pos: "부사" },
    { kana: "はりしごと", kanji: "針仕事", meaning: "바느질", pos: "명사" },
  ],
  N1: [
    { kana: "てんじる", kanji: "点じる", meaning: "점을 찍다, 점점이 흩뿌리다", pos: "동사" },
    { kana: "つばき", kanji: "椿", meaning: "동백꽃", pos: "명사" },
    { kana: "いけがき", kanji: "生垣", meaning: "산울타리", pos: "명사" },
    { kana: "おれこむ", kanji: "折れ込む", meaning: "(길이) 꺾여 들어가다", pos: "동사" },
    { kana: "つぎのま", kanji: "次の間", meaning: "옆방, 다음 방", pos: "명사" },
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
  "先生": { level: "N5", index: 337 },
  "迷惑": { level: "N3", index: 235 },
  "庭": { level: "N5", index: 474 },
  "方": { level: "N5", index: 532 },
  "向く": { level: "N4", index: 21 },
  "この間": { level: "N4", index: 70 },
  "重い": { level: "N5", index: 134 },
  "赤い": { level: "N5", index: 3 },
  "強い": { level: "N5", index: 382 },
  "色": { level: "N5", index: 77 },
  "花": { level: "N5", index: 497 },
  "一つ": { level: "N5", index: 510 },
  "見える": { level: "N5", index: 623 },
  "座敷": { level: "N2", index: 195 },
  "眺める": { level: "N2", index: 50 },
  "信用": { level: "N3", index: 372 },
  "特に": { level: "N4", index: 168 },
  "あなた": { level: "N5", index: 23 },
  "人間": { level: "N4", index: 79 },
  "時": { level: "N5", index: 403 },
  "向う": { level: "N4", index: 115 },
  "声": { level: "N5", index: 228 },
  "外": { level: "N5", index: 341 },
  "聞こえる": { level: "N5", index: 701 },
  "二丁": { level: "N1", index: 63 },
  "深い": { level: "N4", index: 221 },
  "静か": { level: "N4", index: 126 },
  "家": { level: "N5", index: 42 },
  "中": { level: "N5", index: 424 },
  "私": { level: "N3", index: 43 },
  "奥さん": { level: "N5", index: 105 },
  "事": { level: "N5", index: 240 },
  "知る": { level: "N5", index: 316 },
  "黙る": { level: "N4", index: 105 },
  "仕事": { level: "N5", index: 278 },
  "何か": { level: "N4", index: 27 },
  "耳": { level: "N5", index: 564 },
  "話": { level: "N5", index: 498 },
  "話し声": { level: "N2", index: 224 },
  "聞く": { level: "N5", index: 182 },
  "全く": { level: "N3", index: 147 },
  "忘れる": { level: "N5", index: 650 },
  "なさる": { level: "N4", index: 124 },
  "少し": { level: "N5", index: 324 },
  "不安": { level: "N3", index: 133 },
  "顔": { level: "N5", index: 152 },
  "そうして": { level: "N3", index: 59 },
  "答え": { level: "N5", index: 713 },
  "避ける": { level: "N3", index: 11 },
  "通り": { level: "N4", index: 49 },
  "通る": { level: "N4", index: 49 },
  "一つも": { level: "N5", index: 510 },
};
Object.assign(ref, idx);

const V = (k, r, m, word) => ({
  kanji: k,
  reading: r,
  meaning: m,
  ...(ref[word ?? k] ? { ref: ref[word ?? k] } : {}),
});

// ===== 3. Sentences 549-555 =====
const h = (t, e = false) => ({ t, e });

const sentences = [
  {
    id: 549,
    paragraph: 14,
    original:
      "先生は迷惑そうに庭の方を向いた。その庭に、この間まで重そうな赤い強い色をぽたぽた点じていた椿つばきの花はもう一つも見えなかった。先生は座敷からこの椿の花をよく眺ながめる癖があった。",
    hiragana: [
      h("せんせい", true), h("は ", false),
      h("めいわく", true), h("そうに ", false),
      h("にわ", true), h("の ", false),
      h("ほう", true), h("を ", false),
      h("む", true), h("いた。その ", false),
      h("にわ", true), h("に、この ", false),
      h("あいだ", true), h("まで ", false),
      h("おも", true), h("そうな ", false),
      h("あか", true), h("い ", false),
      h("つよ", true), h("い ", false),
      h("いろ", true), h("をぽたぽた ", false),
      h("てん", true), h("じていた ", false),
      h("つばき", true), h("の ", false),
      h("はな", true), h("はもう ", false),
      h("ひと", true), h("つも ", false),
      h("み", true), h("えなかった。 ", false),
      h("せんせい", true), h("は ", false),
      h("ざしき", true), h("からこの ", false),
      h("つばき", true), h("の ", false),
      h("はな", true), h("をよく ", false),
      h("なが", true), h("める ", false),
      h("くせ", true), h("があった。", false),
    ],
    meaning:
      "선생님은 난처한 듯이 정원 쪽으로 고개를 돌렸다. 그 정원에, 얼마 전까지 무겁게 보이는 붉고 강한 색을 뚝뚝 점점이 흩뿌리고 있던 동백꽃은 이제 하나도 보이지 않았다. 선생님은 객실에서 이 동백꽃을 자주 바라보는 버릇이 있었다.",
    vocab: [
      V("先生", "せんせい", "선생"),
      V("迷惑", "めいわく", "난처함, 성가심"),
      V("庭", "にわ", "정원"),
      V("方", "ほう", "쪽"),
      V("向く", "むく", "향하다"),
      V("この間", "このあいだ", "얼마 전"),
      V("重い", "おもい", "무겁다"),
      V("赤い", "あかい", "붉다"),
      V("強い", "つよい", "강하다"),
      V("色", "いろ", "색"),
      V("ぽたぽた", "ぽたぽた", "뚝뚝"),
      V("点じる", "てんじる", "점점이 흩뿌리다"),
      V("椿", "つばき", "동백"),
      V("花", "はな", "꽃"),
      V("一つも", "ひとつも", "하나도"),
      V("見える", "みえる", "보이다"),
      V("座敷", "ざしき", "객실, 다다미방"),
      V("眺める", "ながめる", "바라보다"),
      V("癖", "くせ", "버릇"),
    ],
    grammar: [
      { element: "迷惑そうに", desc: "「迷惑」+「そうだ」 양태. '성가신 듯이'. 선생님의 내면을 외부 묘사로 드러냄." },
      {
        element: "ぽたぽた点じていた",
        desc: "'뚝뚝 점을 찍듯이'. 의태어 「ぽたぽた」가 「点じる」를 수식해, 동백 꽃잎이 한 점씩 떨어져 쌓이던 과거 풍경을 시각화.",
      },
      { element: "もう一つも見えなかった", desc: "'이제 하나도 보이지 않았다'. 시간의 전후를 대비 — 예전엔 점점이 있었지만 지금은 모두 사라짐." },
      { element: "〜癖があった", desc: "'~하는 버릇이 있었다'. 선생님의 습관적 행동을 서술하는 배경 정보." },
    ],
    notes: [
      {
        title: "동백 — 선생님의 객관적 상관물",
        body: "붉고 무거운 꽃이 한 잎씩 점 찍듯 떨어지다 지금은 한 점도 없음. 13단락에서 말해 버린 '사랑은 죄악이자 신성'이 다 떨어져 나간 뒤의 공백을, 꽃이 사라진 정원이 대신 말한다.",
      },
      {
        title: "시선의 회피",
        body: "546에서 화자가 '경박/불신용' 반격, 547~548에서 교착 → 549에서 선생님이 '정원 쪽으로 고개를 돌린다'. 시선의 도주가 대화의 피로를 기록한다.",
      },
      {
        title: "「点じる」의 시적 선택",
        body: "平易한 「散らす」나 「落とす」 대신 「点じる」. 점 찍듯 한 잎씩 내려앉는 느린 시간 감각. 소세키 특유의 문어적 회화미.",
      },
    ],
    translations: {
      literal:
        "선생은 난처한 듯이 정원 쪽으로 몸을 돌렸다. 그 정원에, 얼마 전까지 무겁게 보이는 붉고 강한 색을 뚝뚝 점점이 흩뿌리고 있던 동백꽃은 이제 하나도 보이지 않았다. 선생은 좌식방에서 이 동백꽃을 자주 바라보는 버릇이 있었다.",
      liberal:
        "선생님은 난감한 기색으로 정원 쪽을 바라다보았다. 불과 얼마 전까지만 해도 묵직한 진홍빛을 한 송이 한 송이 뚝뚝 떨구며 점점이 수놓고 있던 동백꽃이, 이제는 어느 한 송이도 보이지 않았다. 선생님은 사랑방에서 이 동백꽃을 유심히 바라보시는 버릇이 있으셨다.",
    },
  },
  {
    id: 550,
    paragraph: 14,
    original:
      "「信用しないって、特にあなたを信用しないんじゃない。人間全体を信用しないんです」",
    hiragana: [
      h("「 ", false),
      h("しんよう", true), h("しないって、 ", false),
      h("とく", true), h("にあなたを ", false),
      h("しんよう", true), h("しないんじゃない。 ", false),
      h("にんげん", true), h(" ", false),
      h("ぜんたい", true), h("を ", false),
      h("しんよう", true), h("しないんです」", false),
    ],
    meaning:
      "「믿지 않는다고 해도, 특별히 자네만을 믿지 못하는 것이 아닐세. 나는 인간 전체를 믿지 못하는 것이네」",
    vocab: [
      V("信用", "しんよう", "신용"),
      V("特に", "とくに", "특히"),
      V("あなた", "あなた", "자네, 당신"),
      V("人間", "にんげん", "인간"),
      V("全体", "ぜんたい", "전체"),
    ],
    grammar: [
      { element: "〜って", desc: "'~라고'. 앞의 화제를 받아 반복하며 답하는 구어적 인용 조사. 화자 546 발화의 반영." },
      {
        element: "特にあなたを〜じゃない。人間全体を〜",
        desc: "부분 부정(A가 아니라) + 전체 긍정(B 전체) 병렬. 화자를 향한 불신용을 '인간 일반의 불신용'으로 확대해 개인의 항의를 무력화.",
      },
    ],
    notes: [
      {
        title: "「人間全体を信用しない」 — 선생님의 근본 명제",
        body: "13단락 141 「自分を近づく価値のないもの」, 12단락의 「淋しい人間」이 여기서 한 문장으로 결정(結晶). 화자에 대한 불신이 아니라 '인간 전체'를 믿지 못하는 것 — 『こころ』 후반 「遺書」의 근본 감각이 이 한 줄에 선언된다.",
      },
      {
        title: "개인 vs 전체의 교묘한 전환",
        body: "화자는 '내가 그렇게 경박한가'라고 개인으로 물었다(546). 선생님은 그 물음을 '인간 전체'로 옮겨 개인적 상처를 털어 낸다. 동시에 가장 깊은 자기 고백이 된다.",
      },
    ],
    translations: {
      literal:
        "「믿지 않는다고 하더라도, 특별히 자네를 믿지 못하는 것이 아닐세. 인간 전체를 믿지 못하는 것일세」",
      liberal:
        "「믿지 못한다고 한들 그것이 콕 집어 자네를 믿지 못한다는 뜻은 아닐세. 나는 인간이라는 것 자체를 도무지 믿지 못하는 것일세」",
    },
  },
  {
    id: 551,
    paragraph: 14,
    original:
      "その時生垣いけがきの向うで金魚売りらしい声がした。その外ほかには何の聞こえるものもなかった。",
    hiragana: [
      h("その ", false),
      h("とき", true), h(" ", false),
      h("いけがき", true), h("の ", false),
      h("む", true), h("うで ", false),
      h("きんぎょ", true), h(" ", false),
      h("う", true), h("りらしい ", false),
      h("こえ", true), h("がした。その ", false),
      h("ほか", true), h("には ", false),
      h("なに", true), h("の ", false),
      h("き", true), h("こえるものもなかった。", false),
    ],
    meaning:
      "그때 산울타리 건너편에서 금붕어 장수인 듯한 소리가 들렸다. 그 밖에는 아무것도 들려오는 것이 없었다.",
    vocab: [
      V("時", "とき", "때"),
      V("生垣", "いけがき", "산울타리"),
      V("向う", "むこう", "건너편"),
      V("金魚", "きんぎょ", "금붕어"),
      V("売り", "うり", "장수"),
      V("声", "こえ", "소리"),
      V("外", "ほか", "밖, 그 외"),
      V("聞こえる", "きこえる", "들리다"),
    ],
    grammar: [
      {
        element: "金魚売り",
        desc: "'금붕어 장수'. 메이지~다이쇼 시기 도쿄 주택가를 돌며 「きんぎょー え、きんぎょー」 외치던 행상. 계절어(夏).",
      },
      { element: "〜らしい声", desc: "「らしい」 추측. '~인 듯한 소리'. 확실히 보지 못하고 들린 추정." },
      { element: "何の〜ものもない", desc: "'아무 ~도 없다'. 전면 부정으로 주변의 완전한 정적을 그린다." },
    ],
    notes: [
      {
        title: "정적 속 단 하나의 소리",
        body: "550의 무거운 선언 뒤 찾아오는 바깥 소리 — 금붕어 장수의 외침. 인간 전체를 믿지 못하는 선생님의 말 끝에, 거리의 생활 소리 하나만이 남는 대조.",
      },
      {
        title: "계절 표지",
        body: "금붕어 장수는 여름의 정취. 9단락 361 「音楽会だの芝居だの」의 겨울·봄에서 14단락은 여름으로 시간이 흘렀음을 한 소절로 표시.",
      },
    ],
    translations: {
      literal:
        "그때 산울타리 건너편에서 금붕어 장수인 듯한 소리가 났다. 그 외에는 들려오는 것이 아무것도 없었다.",
      liberal:
        "마침 그 순간, 산울타리 저편에서 금붕어를 파는 장수의 것인 듯한 외침이 한 가닥 들려왔다. 그 밖에는 귀에 닿아 오는 어떠한 소리도 없었다.",
    },
  },
  {
    id: 552,
    paragraph: 14,
    original:
      "大通りから二丁ちょうも深く折れ込んだ小路こうじは存外ぞんがい静かであった。家うちの中はいつもの通りひっそりしていた。",
    hiragana: [
      h("おおどお", true), h("りから ", false),
      h("にちょう", true), h("も ", false),
      h("ふか", true), h("く ", false),
      h("お", true), h("れ ", false),
      h("こ", true), h("んだ ", false),
      h("こうじ", true), h("は ", false),
      h("ぞんがい", true), h(" ", false),
      h("しず", true), h("かであった。 ", false),
      h("うち", true), h("の ", false),
      h("なか", true), h("はいつもの ", false),
      h("とお", true), h("りひっそりしていた。", false),
    ],
    meaning:
      "큰길에서 두 정이나 깊이 꺾여 들어간 골목은 뜻밖에 조용했다. 집 안은 여느 때처럼 쥐 죽은 듯 고요했다.",
    vocab: [
      V("大通り", "おおどおり", "큰길"),
      V("二丁", "にちょう", "2정 (약 220m)"),
      V("深い", "ふかく", "깊이"),
      V("折れ込む", "おれこむ", "꺾여 들어가다"),
      V("小路", "こうじ", "골목"),
      V("存外", "ぞんがい", "뜻밖에"),
      V("静か", "しずか", "조용함"),
      V("家", "うち", "집"),
      V("中", "なか", "안"),
      V("いつもの通り", "いつものとおり", "여느 때처럼"),
      V("ひっそり", "ひっそり", "조용히, 쥐 죽은 듯"),
    ],
    grammar: [
      {
        element: "二丁も深く折れ込んだ",
        desc: "'두 정이나 깊숙이 꺾여 들어간'. 「も」 강조 + 「深く」 + 「折れ込む」 복합어로 물리적 깊이감을 세 겹으로 표현.",
      },
      { element: "存外〜", desc: "'뜻밖에, 의외로'. 대도시 도쿄 안쪽에도 이토록 고요한 골목이 있다는 놀라움." },
      { element: "いつもの通りひっそり", desc: "「いつもの通り」 = '여느 때처럼' + 「ひっそり」 의태어 = 쥐 죽은 듯. 선생님 댁의 상례가 그대로 유지됨." },
    ],
    notes: [
      {
        title: "소리 → 공간 → 집의 확장 렌즈",
        body: "551의 「금붕어 장수 소리」에서 출발해, 551 → 552 → 553으로 카메라가 점점 안쪽으로 당겨진다. 산울타리 밖 → 골목 → 집 내부 → 옆방의 아내.",
      },
      {
        title: "「存外」 — 선생님 댁의 입지",
        body: "342 「ひそりとしていた」가 선생님 댁 내부의 고요였다면, 552의 「存外静か」는 그 집이 위치한 도쿄 한복판의 골목 전체가 시대와 동떨어져 있음을 확장.",
      },
    ],
    translations: {
      literal:
        "큰길에서 두 정이나 깊이 꺾여 들어간 골목은 뜻밖에도 조용했다. 집 안은 여느 때처럼 쥐 죽은 듯 고요했다.",
      liberal:
        "대로에서 두 정 남짓 안쪽으로 깊숙이 꺾여 들어간 그 골목은 의외라 싶을 만큼 고요했다. 집 안 역시 여느 때와 마찬가지로 숨죽인 듯 조용히 가라앉아 있었다.",
    },
  },
  {
    id: 553,
    paragraph: 14,
    original:
      "私は次の間まに奥さんのいる事を知っていた。黙って針仕事か何かしている奥さんの耳に私の話し声が聞こえるという事も知っていた。しかし私は全くそれを忘れてしまった。",
    hiragana: [
      h("わたくし", true), h("は ", false),
      h("つぎ", true), h("の ", false),
      h("ま", true), h("に ", false),
      h("おく", true), h("さんのいる ", false),
      h("こと", true), h("を ", false),
      h("し", true), h("っていた。 ", false),
      h("だま", true), h("って ", false),
      h("はりしごと", true), h("か ", false),
      h("なに", true), h("かしている ", false),
      h("おく", true), h("さんの ", false),
      h("みみ", true), h("に ", false),
      h("わたくし", true), h("の ", false),
      h("はな", true), h("し ", false),
      h("ごえ", true), h("が ", false),
      h("き", true), h("こえるという ", false),
      h("こと", true), h("も ", false),
      h("し", true), h("っていた。しかし ", false),
      h("わたくし", true), h("は ", false),
      h("まった", true), h("くそれを ", false),
      h("わす", true), h("れてしまった。", false),
    ],
    meaning:
      "나는 옆방에 사모님이 있다는 것을 알고 있었다. 말없이 바느질인지 무엇인지를 하고 있는 사모님의 귀에 내 말소리가 들린다는 것도 알고 있었다. 그러나 나는 그것을 완전히 잊고 있었다.",
    vocab: [
      V("私", "わたくし", "나"),
      V("次の間", "つぎのま", "옆방"),
      V("奥さん", "おくさん", "사모님"),
      V("事", "こと", "일"),
      V("知る", "しる", "알다"),
      V("黙る", "だまる", "입을 다물다"),
      V("針仕事", "はりしごと", "바느질"),
      V("何か", "なにか", "무언가"),
      V("耳", "みみ", "귀"),
      V("話し声", "はなしごえ", "말소리"),
      V("聞こえる", "きこえる", "들리다"),
      V("全く", "まったく", "완전히"),
      V("忘れる", "わすれる", "잊다"),
    ],
    grammar: [
      { element: "次の間", desc: "'옆방, 다다미방 옆에 붙은 또 하나의 방'. 일본 전통 가옥의 공간 구조 용어." },
      {
        element: "針仕事か何か",
        desc: "「か何か」 = '~이든가 뭔가'. 구체적으로 정하지 않고 범위를 열어 두는 구어. 화자가 실제로 보지 않고 짐작으로 쓴 표현.",
      },
      { element: "〜を忘れてしまった", desc: "「〜てしまう」 완료 + 회한. '잊고 말았다' — 대화의 긴장에 빠져 주위를 놓쳤다는 뉘앙스." },
    ],
    notes: [
      {
        title: "보이지 않는 제3자",
        body: "사모님은 등장하지 않지만 벽 하나 너머에 있다. '듣고 있을 것'이 분명한 사람을 '완전히 잊어버렸다'는 고백이, 다음 문장 554의 큰 도박('사모님도 믿지 않느냐')으로 이어지는 심리적 조건을 만든다.",
      },
      {
        title: "세 겹의 앎과 하나의 망각",
        body: "① 사모님이 옆방에 있음을 안다 → ② 내 목소리가 들린다는 것도 안다 → ③ 그럼에도 잊었다. 앎이 아무리 많아도 순간의 감정이 그것을 지운다는 소세키 특유의 심리 해부.",
      },
    ],
    translations: {
      literal:
        "나는 옆방에 사모님이 계신다는 사실을 알고 있었다. 말없이 바느질이든 뭔가를 하고 계신 사모님의 귀에 내 말소리가 들린다는 사실도 알고 있었다. 그러나 나는 그것을 완전히 잊고 있었다.",
      liberal:
        "옆방에 사모님이 계시다는 사실을 나는 분명 알고 있었다. 조용히 바느질이든 무엇이든 하고 계실 사모님의 귀에 우리의 이야기 소리가 고스란히 닿고 있다는 것 또한 알고 있었다. 그런데도 나는 그 사실을 까맣게 잊어버리고 있었던 것이다.",
    },
  },
  {
    id: 554,
    paragraph: 14,
    original: "「じゃ奥さんも信用なさらないんですか」と先生に聞いた。",
    hiragana: [
      h("「じゃ ", false),
      h("おく", true), h("さんも ", false),
      h("しんよう", true), h("なさらないんですか」と ", false),
      h("せんせい", true), h("に ", false),
      h("き", true), h("いた。", false),
    ],
    meaning: "「그럼 사모님도 믿지 않으시는 겁니까」라고 선생님께 물었다.",
    vocab: [
      V("じゃ", "じゃ", "그럼"),
      V("奥さん", "おくさん", "사모님"),
      V("信用", "しんよう", "신용"),
      V("なさる", "なさる", "하시다"),
      V("先生", "せんせい", "선생"),
      V("聞く", "きく", "묻다"),
    ],
    grammar: [
      { element: "じゃ〜も", desc: "'그럼 ~도'. 앞 발언(「人間全体」)을 받아 가장 가까운 예외(사모님)를 들이대는 구어적 반문." },
      {
        element: "信用なさらない",
        desc: "「信用する」의 존경 부정. 「なさる」 존경 조동사. 화자가 예의를 지키면서 가장 민감한 부분을 찌름.",
      },
    ],
    notes: [
      {
        title: "경계를 넘는 질문",
        body: "553에서 '사모님이 듣고 있음을 잊어버린' 결과, 화자는 사모님을 포함한 반문으로 건너뛴다. 집 안에서 절대 물어서는 안 되는 질문. 14단락 중반의 폭발점.",
      },
    ],
    translations: {
      literal: "「그럼 사모님도 믿지 않으시는 것입니까」라고 선생에게 물었다.",
      liberal: "「그렇다면 사모님조차도 믿지 않으신다는 말씀이십니까」 하고 나는 선생님께 물었다.",
    },
  },
  {
    id: 555,
    paragraph: 14,
    original: "先生は少し不安な顔をした。そうして直接の答えを避けた。",
    hiragana: [
      h("せんせい", true), h("は ", false),
      h("すこ", true), h("し ", false),
      h("ふあん", true), h("な ", false),
      h("かお", true), h("をした。そうして ", false),
      h("ちょくせつ", true), h("の ", false),
      h("こた", true), h("えを ", false),
      h("さ", true), h("けた。", false),
    ],
    meaning: "선생님은 조금 불안한 얼굴을 했다. 그러고는 직접적인 답을 피했다.",
    vocab: [
      V("先生", "せんせい", "선생"),
      V("少し", "すこし", "조금"),
      V("不安", "ふあん", "불안"),
      V("顔", "かお", "얼굴"),
      V("そうして", "そうして", "그러고는"),
      V("直接", "ちょくせつ", "직접"),
      V("答え", "こたえ", "답"),
      V("避ける", "さける", "피하다"),
    ],
    grammar: [
      { element: "不安な顔をした", desc: "「顔をする」 관용구. 표정을 짓다. 내면 상태를 얼굴이라는 외부 표지로 묘사." },
      { element: "直接の答えを避ける", desc: "'직접적인 답을 피하다'. 거절도 긍정도 아닌 '회피'. 가장 많은 것을 암시하는 반응." },
    ],
    notes: [
      {
        title: "회피 = 가장 큰 답",
        body: "「信用しない」라고 선언하지도, 「信用する」라고 해명하지도 않는 선생님. 이 회피가 사모님에 대한 복잡한 감정의 실존을 가장 강하게 드러낸다.",
      },
      {
        title: "「不安な顔」 — 화자 앞에서 처음 보이는 약한 얼굴",
        body: "12단락의 「淋しい人間」, 13단락의 결연한 선언자에서, 14단락에서 처음으로 선생님의 얼굴에 '불안'이 비친다. 사모님이 관련된 순간에만 드러나는 단면.",
      },
    ],
    translations: {
      literal: "선생은 조금 불안한 얼굴을 했다. 그러고는 직접적인 답을 피했다.",
      liberal: "선생님은 잠시 불안한 기색을 얼굴에 내비쳤다. 그러고는 그 질문에 대한 직접적인 대답을 일부러 비껴 가셨다.",
    },
  },
];

for (const s of sentences) novel.push(s);

// ===== 4. Paragraph map =====
const p14 = paraMap.paragraphs.find((p) => p.paragraph === 14);
if (p14) p14.range = [538, 555];
else paraMap.paragraphs.push({ paragraph: 14, range: [538, 555] });

// ===== Write =====
writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2) + "\n", "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2) + "\n", "utf8");
writeFileSync(novelParaPath, JSON.stringify(paraMap, null, 2) + "\n", "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocab[lv], null, 2) + "\n", "utf8");
}

console.log("Added paragraph 14 sentences 549-555.");
console.log("New kanji:", Object.keys(newKanji).join(", "));
console.log("New vocab indices:");
for (const [k, v] of Object.entries(idx)) console.log(`  ${k} -> ${v.level}#${v.index}`);
