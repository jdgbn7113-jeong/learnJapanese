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
  "呪": nk("呪", ["ジュ"], ["のろ-う"], ["저주하다"], "N2", 0, 8,
    [["口", "입", "left"], ["兄", "맏이·말하는 사람", "right"]],
    "口(입)으로 兄(사람)이 재앙을 빎 — 저주를 퍼붓다.",
    "입으로 재앙을 빔 = 저주",
    [{ word: "呪う", reading: "のろう", meaning: "저주하다" }, { word: "呪文", reading: "じゅもん", meaning: "주문" }]),
  "確": nk("確", ["カク"], ["たし-か", "たし-かめる"], ["확실", "굳다"], "N3", 5, 15,
    [["石", "돌", "left"], ["隺", "높이 나는 새", "right"]],
    "石(돌)처럼 흔들림 없고 隺(높이 솟은 기세)로 굳은 상태 — 확실.",
    "돌같이 굳음 = 확실",
    [{ word: "確か", reading: "たしか", meaning: "확실한" }, { word: "確認", reading: "かくにん", meaning: "확인" }]),
  "辿": nk("辿", ["テン"], ["たど-る"], ["더듬다"], "N1", 0, 7,
    [["辶", "쉬엄쉬엄 감(착)", "outer"], ["山", "산", "inner"]],
    "辶(길)을 따라 山(산)을 한 걸음씩 더듬어 오르는 모양 — 따라가다.",
    "산길을 더듬어 감 = 辿る",
    [{ word: "辿る", reading: "たどる", meaning: "더듬어 가다" }]),
  "陰": nk("陰", ["イン"], ["かげ"], ["그늘", "숨다"], "N3", 0, 11,
    [["阝", "언덕(좌부방)", "left"], ["今", "지금", "topright"], ["云", "구름", "bottomright"]],
    "阝(언덕) 뒤로 今(지금) 云(구름)이 드리워 빛이 가려진 자리 — 그늘.",
    "언덕 뒤 구름 그늘 = 陰",
    [{ word: "陰", reading: "かげ", meaning: "그늘, 음지" }, { word: "陰気", reading: "いんき", meaning: "음기, 음침함" }]),
  "余": nk("余", ["ヨ"], ["あま-る", "あま-り"], ["남다", "나"], "N3", 5, 7,
    [["𠆢", "지붕", "top"], ["示/禾 변형", "남은 몸체", "bottom"]],
    "지붕 아래 몸체가 남아 있는 모양 — 여분, 나머지.",
    "지붕 아래 남음 = 余",
    [{ word: "余裕", reading: "よゆう", meaning: "여유" }, { word: "余る", reading: "あまる", meaning: "남다" }]),
  "裕": nk("裕", ["ユウ"], [], ["넉넉하다"], "N2", 0, 12,
    [["衤", "옷(옷의변)", "left"], ["谷", "골·빈 공간", "right"]],
    "衤(옷)이 谷(빈 공간처럼) 넉넉한 상태 — 여유.",
    "품이 넉넉한 옷 = 유(裕)",
    [{ word: "余裕", reading: "よゆう", meaning: "여유" }, { word: "裕福", reading: "ゆうふく", meaning: "유복" }]),
  "悔": nk("悔", ["カイ"], ["く-いる", "くや-しい"], ["뉘우치다"], "N3", 0, 9,
    [["忄", "마음(심방변)", "left"], ["毎", "매번", "right"]],
    "忄(마음)이 毎(매번) 앞날을 되돌아봄 — 후회.",
    "매번 돌이키는 마음 = 후회",
    [{ word: "後悔", reading: "こうかい", meaning: "후회" }, { word: "悔しい", reading: "くやしい", meaning: "분하다" }]),
  "欺": nk("欺", ["ギ"], ["あざむ-く"], ["속이다"], "N1", 0, 12,
    [["其", "그·상자", "left"], ["欠", "하품·벌린 입", "right"]],
    "其(상자 모양의 겉) + 欠(입을 벌려 과장하는 몸짓) — 겉과 말로 남을 속임.",
    "상자를 흔들며 벌린 입 = 속이다",
    [{ word: "欺く", reading: "あざむく", meaning: "속이다" }, { word: "詐欺", reading: "さぎ", meaning: "사기" }]),
  "酷": nk("酷", ["コク"], ["ひど-い"], ["가혹"], "N2", 0, 14,
    [["酉", "술병", "left"], ["告", "고하다·몰다", "right"]],
    "酉(진한 술)처럼 강도가 告(극도로) 치솟은 상태 — 가혹, 혹독.",
    "진한 술처럼 독함 = 酷",
    [{ word: "残酷", reading: "ざんこく", meaning: "잔혹" }, { word: "酷い", reading: "ひどい", meaning: "지독하다" }]),
  "讐": nk("讐", ["シュウ"], ["あだ"], ["원수", "갚다"], "N1", 0, 23,
    [["雠", "새 두 마리가 마주섬", "outer"], ["言", "말", "middle"]],
    "雠(두 새가 마주 서서 다툼) + 言(말)로 되받아침 — 원수, 갚음.",
    "마주 선 둘의 말싸움 = 원수",
    [{ word: "復讐", reading: "ふくしゅう", meaning: "복수" }, { word: "恩讐", reading: "おんしゅう", meaning: "은혜와 원한" }]),
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

const newVocab = {
  N5: [
    { kana: "なる", kanji: "なる", meaning: "되다", pos: "동사" },
  ],
  N4: [
    { kana: "たしか", kanji: "確か", meaning: "확실한, 아마도", pos: "な형용사·부사" },
    { kana: "やる", kanji: "やる", meaning: "하다, 행하다", pos: "동사" },
    { kana: "こわい", kanji: "怖い", meaning: "무섭다, 두렵다", pos: "い형용사" },
    { kana: "もうすこし", kanji: "もう少し", meaning: "좀 더", pos: "부사" },
    { kana: "ようじ", kanji: "用事", meaning: "볼일, 용무", pos: "명사" },
  ],
  N3: [
    { kana: "わたくしじしん", kanji: "私自身", meaning: "나 자신", pos: "명사" },
    { kana: "だれだって", kanji: "誰だって", meaning: "누구라도", pos: "부정대명사" },
    { kana: "だって", kanji: "だって", meaning: "~라도, ~이라고 해도", pos: "조사·접속" },
    { kana: "ひじょう", kanji: "非常", meaning: "비상, 보통이 아님", pos: "명사·な형용사" },
    { kana: "かげ", kanji: "陰", meaning: "그늘, 뒤편", pos: "명사" },
    { kana: "なんだい", kanji: "何だい", meaning: "뭐야? (구어 남성체)", pos: "연어" },
    { kana: "こうかい", kanji: "後悔", meaning: "후회", pos: "명사·동사" },
  ],
  N2: [
    { kana: "のろう", kanji: "呪う", meaning: "저주하다", pos: "동사" },
    { kana: "よゆう", kanji: "余裕", meaning: "여유", pos: "명사" },
    { kana: "ざんこく", kanji: "残酷", meaning: "잔혹", pos: "な형용사" },
    { kana: "ふくしゅう", kanji: "復讐", meaning: "복수", pos: "명사·동사" },
  ],
  N1: [
    { kana: "たどる", kanji: "辿る", meaning: "더듬어 가다, 따라가다", pos: "동사" },
    { kana: "あざむく", kanji: "欺く", meaning: "속이다", pos: "동사" },
    { kana: "へんぽう", kanji: "返報", meaning: "앙갚음, 보복", pos: "명사" },
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
  "私": { level: "N3", index: 43 },
  "さえ": { level: "N5", index: 640 },
  "信用": { level: "N3", index: 372 },
  "つまり": { level: "N3", index: 273 },
  "自分": { level: "N4", index: 26 },
  "人": { level: "N5", index: 509 },
  "仕方": { level: "N4", index: 219 },
  "外": { level: "N5", index: 341 },
  "難しい": { level: "N5", index: 568 },
  "考える": { level: "N5", index: 624 },
  "誰": { level: "N5", index: 364 },
  "驚く": { level: "N5", index: 711 },
  "非常に": { level: "N4", index: 224 },
  "後": { level: "N5", index: 485 },
  "少し": { level: "N5", index: 324 },
  "先": { level: "N5", index: 259 },
  "同じ": { level: "N5", index: 124 },
  "道": { level: "N5", index: 558 },
  "行く": { level: "N5", index: 43 },
  "襖": { level: "N1", index: 160 },
  "奥さん": { level: "N5", index: 105 },
  "声": { level: "N5", index: 228 },
  "二度": { level: "N5", index: 658 },
  "二度目": { level: "N4", index: 91 },
  "聞こえる": { level: "N5", index: 701 },
  "何": { level: "N5", index: 434 },
  "だい": { level: "N3", index: 71 },
  "ちょっと": { level: "N5", index: 375 },
  "先生": { level: "N5", index: 337 },
  "次の間": { level: "N1", index: 221 },
  "呼ぶ": { level: "N5", index: 601 },
  "二人": { level: "N5", index: 522 },
  "間": { level: "N5", index: 0 },
  "どんな": { level: "N5", index: 422 },
  "起こる": { level: "N4", index: 44 },
  "解る": { level: "N3", index: 120 },
  "想像": { level: "N3", index: 239 },
  "与える": { level: "N3", index: 143 },
  "ほど": { level: "N3", index: 94 },
  "早い": { level: "N5", index: 502 },
  "座敷": { level: "N2", index: 195 },
  "帰る": { level: "N5", index: 151 },
  "来る": { level: "N5", index: 215 },
  "とにかく": { level: "N3", index: 213 },
  "あまり": { level: "N5", index: 30 },
  "今に": { level: "N3", index: 355 },
  "もの": { level: "N5", index: 577 },
};
Object.assign(ref, idx);

const V = (k, r, m, word) => ({
  kanji: k,
  reading: r,
  meaning: m,
  ...(ref[word ?? k] ? { ref: ref[word ?? k] } : {}),
});

const h = (t, e = false) => ({ t, e });

const sentences = [
  {
    id: 556,
    paragraph: 14,
    original:
      "「私は私自身さえ信用していないのです。つまり自分で自分が信用できないから、人も信用できないようになっているのです。自分を呪のろうより外ほかに仕方がないのです」",
    hiragana: [
      h("「 ", false),
      h("わたくし", true), h("は ", false),
      h("わたくしじしん", true), h("さえ ", false),
      h("しんよう", true), h("していないのです。つまり ", false),
      h("じぶん", true), h("で ", false),
      h("じぶん", true), h("が ", false),
      h("しんよう", true), h("できないから、 ", false),
      h("ひと", true), h("も ", false),
      h("しんよう", true), h("できないようになっているのです。 ", false),
      h("じぶん", true), h("を ", false),
      h("のろ", true), h("うより ", false),
      h("ほか", true), h("に ", false),
      h("しかた", true), h("がないのです」", false),
    ],
    meaning:
      "「나는 나 자신조차 믿지 못하고 있다네. 말하자면 스스로를 스스로 믿지 못하기에, 타인도 믿을 수 없게 되어 버린 걸세. 자기를 저주하는 것 외에는 어쩔 도리가 없네」",
    vocab: [
      V("私", "わたくし", "나"),
      V("私自身", "わたくしじしん", "나 자신"),
      V("さえ", "さえ", "~조차"),
      V("信用", "しんよう", "신용"),
      V("つまり", "つまり", "말하자면"),
      V("自分", "じぶん", "자기"),
      V("人", "ひと", "사람"),
      V("呪う", "のろう", "저주하다"),
      V("外", "ほか", "~외"),
      V("仕方", "しかた", "방도"),
    ],
    grammar: [
      { element: "〜さえ", desc: "극단을 드는 조사. '~조차, ~마저'. 자기 자신이라는 가장 가까운 대상마저 포함함을 강조." },
      {
        element: "つまり〜から〜のです",
        desc: "'말하자면 ~때문에 ~인 것이다'. 550의 「人間全体を信用しない」에 대한 내부 논리를 스스로 해부.",
      },
      {
        element: "〜より外に仕方がない",
        desc: "'~ 말고는 어쩔 도리가 없다'. 문어적 고정 구문. 선택지의 완전한 소거를 드러내는 결어.",
      },
    ],
    notes: [
      {
        title: "불신의 원점 — 자기 자신",
        body: "550에서 '인간 전체'로 확장됐던 불신의 원인이 여기서 거꾸로 '나 자신'으로 수렴. 외부 → 내부의 방향이 뒤집힌다. 자기를 믿지 못해 전부를 믿지 못한다는 인과의 역설.",
      },
      {
        title: "「自分を呪う」",
        body: "'자기 저주'라는 강한 명사화. 후일 유서에서 밝혀질 배신자로서의 자의식의 첫 표면화. 이 단어는 단락 어디에서도 다시 나오지 않지만 15~16단락 이후의 행동을 지배.",
      },
    ],
    translations: {
      literal:
        "「나는 나 자신조차 믿지 못하는 것일세. 말하자면 자기가 자기를 믿지 못하기에, 타인 또한 믿지 못하게 된 것일세. 자기를 저주하는 것 말고는 어쩔 방도가 없네」",
      liberal:
        "「나는 나 자신조차도 도무지 믿지 못하고 있네. 말하자면 스스로가 스스로를 믿을 수 없기에, 덩달아 다른 사람까지 믿지 못하는 지경에 이른 것일세. 이제 와서 할 수 있는 것이라고는 그저 내 자신을 저주하는 일밖에 남아 있지 않다네」",
    },
  },
  {
    id: 557,
    paragraph: 14,
    original: "「そうむずかしく考えれば、誰だって確かなものはないでしょう」",
    hiragana: [
      h("「そうむずかしく ", false),
      h("かんが", true), h("えれば、 ", false),
      h("だれ", true), h("だって ", false),
      h("たし", true), h("かなものはないでしょう」", false),
    ],
    meaning: "「그렇게 어렵게 생각하면, 누구라도 확실한 것은 없지 않겠습니까」",
    vocab: [
      V("難しい", "むずかしい", "어려움"),
      V("考える", "かんがえる", "생각하다"),
      V("誰", "だれ", "누구"),
      V("だって", "だって", "~라도"),
      V("確か", "たしか", "확실함"),
      V("もの", "もの", "것"),
    ],
    grammar: [
      { element: "そう〜ば", desc: "'그렇게 ~하면'. 앞의 논리를 받아 되묻는 가정 구문." },
      { element: "誰だって", desc: "'누구라도, 어느 누구든지'. 「も」+「だって」 복합 형태로 전 범위 포괄." },
      {
        element: "〜でしょう",
        desc: "동의 구하기·완곡한 단정. 화자가 선생님의 극단적 자기 부정을 '보편화'로 되받는 논리.",
      },
    ],
    notes: [
      {
        title: "화자의 반박 — 상대화의 전략",
        body: "선생님의 극단적 자기 불신을 '그 논리로 가면 아무도 확실한 게 없다'는 일반화로 상대화. 개인의 고뇌를 철학적 회의로 환원하려는 젊은 독자 특유의 태도.",
      },
    ],
    translations: {
      literal: "「그렇게 어렵게 생각하면, 누구라도 확실한 것은 없지 않겠습니까」",
      liberal: "「그렇게까지 어렵게 파고들기 시작하면, 이 세상 그 누구에게도 확실하다 싶은 것이란 없지 않겠습니까」",
    },
  },
  {
    id: 558,
    paragraph: 14,
    original:
      "「いや考えたんじゃない。やったんです。やった後で驚いたんです。そうして非常に怖こわくなったんです」",
    hiragana: [
      h("「いや ", false),
      h("かんが", true), h("えたんじゃない。やったんです。やった ", false),
      h("あと", true), h("で ", false),
      h("おどろ", true), h("いたんです。そうして ", false),
      h("ひじょう", true), h("に ", false),
      h("こわ", true), h("くなったんです」", false),
    ],
    meaning:
      "「아니, 생각한 게 아니네. 한 것일세. 한 뒤에 놀란 것이네. 그러고 나서 몹시 무서워진 거라네」",
    vocab: [
      V("考える", "かんがえる", "생각하다"),
      V("やる", "やる", "하다"),
      V("後", "あと", "뒤, 후"),
      V("驚く", "おどろく", "놀라다"),
      V("非常", "ひじょう", "매우, 대단히"),
      V("怖い", "こわい", "무섭다"),
    ],
    grammar: [
      {
        element: "考えたんじゃない。やったんです",
        desc: "'생각한 것이 아니라 한 것이다'. 관념적 회의가 아니라 실제 행동의 결과라는 강한 부정·긍정 병렬.",
      },
      { element: "やった後で驚いた", desc: "'하고 나서 놀랐다'. 원인 → 반응의 시간 순서. 의지적 실행 뒤의 자기 직면." },
      { element: "非常に怖くなった", desc: "「なる」 상태 변화. '매우 무서워졌다'. 그 두려움이 사라지지 않고 남아 현재의 불신이 되었다는 함의." },
    ],
    notes: [
      {
        title: "'해 버렸다' — 과거 행위의 암시",
        body: "557의 '생각'을 '행위'로 뒤집는 결정적 고백. 무엇을 했는지는 말하지 않지만, 그 행위가 이후 삶 전체를 결정했음을 암시. 13단락 525의 「ある特別の事情」와 직결 — 『こころ』 후반 K 서사의 또 하나의 복선.",
      },
      {
        title: "세 동사의 계단",
        body: "やった → 驚いた → 怖くなった. 행위 → 인식 → 감정의 3단계로 자기 변화를 요약.",
      },
    ],
    translations: {
      literal:
        "「아닐세, 생각한 것이 아니네. 실제로 저지른 일이네. 저지르고 나서 놀란 것일세. 그리고 더없이 두려워진 것이네」",
      liberal:
        "「아니, 그저 머리로 따져 본 것이 아닐세. 나는 실제로 저질러 버리고 만 게야. 저지른 다음에야 비로소 흠칫 놀랐고, 그러고 나서 걷잡을 수 없는 두려움에 사로잡힌 것이라네」",
    },
  },
  {
    id: 559,
    paragraph: 14,
    original: "私はもう少し先まで同じ道を辿たどって行きたかった。",
    hiragana: [
      h("わたくし", true), h("はもう ", false),
      h("すこ", true), h("し ", false),
      h("さき", true), h("まで ", false),
      h("おな", true), h("じ ", false),
      h("みち", true), h("を ", false),
      h("たど", true), h("って ", false),
      h("い", true), h("きたかった。", false),
    ],
    meaning: "나는 좀 더 앞까지 같은 길을 더듬어 가고 싶었다.",
    vocab: [
      V("私", "わたくし", "나"),
      V("もう少し", "もうすこし", "좀 더"),
      V("先", "さき", "앞"),
      V("同じ", "おなじ", "같다"),
      V("道", "みち", "길"),
      V("辿る", "たどる", "더듬어 가다"),
    ],
    grammar: [
      {
        element: "同じ道を辿る",
        desc: "'같은 길을 따라가다'. 물리적 길이 아니라 선생님의 사고의 흐름. 자기 고백의 연장선을 더 끌고 나가고 싶은 심리.",
      },
      { element: "〜行きたかった", desc: "「〜たかった」 과거 희망. 실제로는 뒤의 중단으로 이루어지지 못함을 미리 예고." },
    ],
    notes: [
      {
        title: "무엇을 했는지 캐고 싶은 욕망",
        body: "558의 '해 버렸다'가 무엇인지 묻고 싶다. 그러나 곧이어 사모님의 목소리(560)가 이 호기심을 끊는다 — 소설적 중단의 기능.",
      },
    ],
    translations: {
      literal: "나는 좀 더 앞까지 같은 길을 더듬어 가고 싶었다.",
      liberal: "나는 한 걸음 더 깊은 데까지 그 이야기의 실마리를 따라가 보고 싶었다.",
    },
  },
  {
    id: 560,
    paragraph: 14,
    original:
      "すると襖ふすまの陰で「あなた、あなた」という奥さんの声が二度聞こえた。先生は二度目に「何だい」といった。",
    hiragana: [
      h("すると ", false),
      h("ふすま", true), h("の ", false),
      h("かげ", true), h("で「あなた、あなた」という ", false),
      h("おく", true), h("さんの ", false),
      h("こえ", true), h("が ", false),
      h("にど", true), h(" ", false),
      h("き", true), h("こえた。 ", false),
      h("せんせい", true), h("は ", false),
      h("にどめ", true), h("に「 ", false),
      h("なん", true), h("だい」といった。", false),
    ],
    meaning:
      "그러자 장지 저편에서 「여보, 여보」 하는 사모님의 목소리가 두 번 들렸다. 선생님은 두 번째에 「무슨 일이오」라고 했다.",
    vocab: [
      V("襖", "ふすま", "장지, 미닫이문"),
      V("陰", "かげ", "뒤편, 그늘"),
      V("奥さん", "おくさん", "사모님"),
      V("声", "こえ", "소리"),
      V("二度", "にど", "두 번"),
      V("聞こえる", "きこえる", "들리다"),
      V("先生", "せんせい", "선생"),
      V("二度目", "にどめ", "두 번째"),
      V("何だい", "なんだい", "무슨 일이오"),
    ],
    grammar: [
      { element: "襖の陰で", desc: "'장지 뒤편에서'. 553에서 「잊어버렸다」고 한 사모님의 존재가 다시 물리적으로 나타나는 순간." },
      {
        element: "二度聞こえた / 二度目に〜といった",
        desc: "「二度」의 반복. 첫 부름은 놓친 선생님이, 두 번째에야 반응. 부부 사이 긴장의 지연을 숫자로 기록.",
      },
      {
        element: "何だい",
        desc: "구어 남성체 「何です」. 친밀한 관계에서의 약간 투박한 반응. 여기서 처음으로 선생님의 평소 말투가 드러남.",
      },
    ],
    notes: [
      {
        title: "553의 복선이 현실화",
        body: "「奥さんが聞いている」을 잊어버린 화자의 질문(554)에 대한 세계의 대답. 화자가 잊은 만큼 사모님이 정확히 그 순간 모습을 드러낸다.",
      },
      {
        title: "일본 가옥의 음향 구조",
        body: "襖(후스마) 한 장으로 나뉜 공간 — 목소리가 그대로 통과. 553에서 '들릴 것을 알고 있다'는 구절의 물리적 근거가 여기 재확인.",
      },
    ],
    translations: {
      literal:
        "그러자 장지 뒤편에서 「여보, 여보」라는 사모님의 목소리가 두 번 들렸다. 선생은 두 번째에 「무슨 일이오」라고 했다.",
      liberal:
        "그 순간, 장지문 너머에서 「여보, 여보」 하고 부르는 사모님의 목소리가 두 차례 들려왔다. 선생님은 두 번째 부름에 이르러서야 「왜 그러오」 하고 대꾸하셨다.",
    },
  },
  {
    id: 561,
    paragraph: 14,
    original:
      "奥さんは「ちょっと」と先生を次の間まへ呼んだ。二人の間にどんな用事が起ったのか、私には解わからなかった。",
    hiragana: [
      h("おく", true), h("さんは「ちょっと」と ", false),
      h("せんせい", true), h("を ", false),
      h("つぎ", true), h("の ", false),
      h("ま", true), h("へ ", false),
      h("よ", true), h("んだ。 ", false),
      h("ふたり", true), h("の ", false),
      h("あいだ", true), h("にどんな ", false),
      h("ようじ", true), h("が ", false),
      h("おこ", true), h("ったのか、 ", false),
      h("わたくし", true), h("には ", false),
      h("わか", true), h("らなかった。", false),
    ],
    meaning:
      "사모님은 「잠깐만」 하고 선생님을 옆방으로 불렀다. 두 사람 사이에 어떤 용무가 생겼는지, 나로서는 알 수 없었다.",
    vocab: [
      V("奥さん", "おくさん", "사모님"),
      V("ちょっと", "ちょっと", "잠깐"),
      V("先生", "せんせい", "선생"),
      V("次の間", "つぎのま", "옆방"),
      V("呼ぶ", "よぶ", "부르다"),
      V("二人", "ふたり", "두 사람"),
      V("間", "あいだ", "사이"),
      V("どんな", "どんな", "어떤"),
      V("用事", "ようじ", "용무"),
      V("起こる", "おこる", "일어나다"),
      V("私", "わたくし", "나"),
      V("解る", "わかる", "알다"),
    ],
    grammar: [
      { element: "「ちょっと」と呼んだ", desc: "인용조사 「と」. 짧은 「잠깐」 한마디로 남편을 불러내는 일상적 호출." },
      {
        element: "どんな用事が起ったのか、〜解らなかった",
        desc: "간접의문 + 몰랐음의 고백. 독자에게도 구체 내용을 감추고, 553~555의 '선생님의 회피'의 연장으로 기능.",
      },
    ],
    notes: [
      {
        title: "화자의 관찰 한계",
        body: "이 장면의 시점 인물은 화자. 사모님이 왜 남편을 불렀는지 알 수 없음이 그대로 독자에게 전달된다. 독자의 궁금증 = 화자의 궁금증.",
      },
      {
        title: "대화의 강제 중단",
        body: "559의 '같은 길을 더 가고 싶었다'는 욕망이 여기서 부서진다. 선생님의 고백은 사모님의 한마디로 멈춘다 — 집 안의 침묵(552)이 가진 또 하나의 기능.",
      },
    ],
    translations: {
      literal:
        "사모님은 「잠깐」이라고 선생을 옆방으로 불렀다. 두 사람 사이에 어떤 용무가 일어났는지, 나로서는 알 수 없었다.",
      liberal:
        "사모님은 「잠시만요」 하며 선생님을 옆방으로 부르셨다. 두 분 사이에 어떤 일이 생긴 것인지는 나로서는 도무지 알 길이 없었다.",
    },
  },
  {
    id: 562,
    paragraph: 14,
    original: "それを想像する余裕を与えないほど早く先生はまた座敷へ帰って来た。",
    hiragana: [
      h("それを ", false),
      h("そうぞう", true), h("する ", false),
      h("よゆう", true), h("を ", false),
      h("あた", true), h("えないほど ", false),
      h("はや", true), h("く ", false),
      h("せんせい", true), h("はまた ", false),
      h("ざしき", true), h("へ ", false),
      h("かえ", true), h("って ", false),
      h("き", true), h("た。", false),
    ],
    meaning:
      "그것을 상상할 여유조차 주지 않을 만큼 빠르게, 선생님은 다시 사랑방으로 돌아왔다.",
    vocab: [
      V("想像", "そうぞう", "상상"),
      V("余裕", "よゆう", "여유"),
      V("与える", "あたえる", "주다"),
      V("ほど", "ほど", "만큼"),
      V("早い", "はやく", "빠르게"),
      V("先生", "せんせい", "선생"),
      V("座敷", "ざしき", "사랑방"),
      V("帰る", "かえる", "돌아오다"),
      V("来る", "くる", "오다"),
    ],
    grammar: [
      {
        element: "〜ほど早く",
        desc: "'~할 만큼 빠르게'. 결과의 정도를 부사절로 표시. '상상조차 못 할 속도'의 비유가 아니라 실제 시간 서술.",
      },
      { element: "〜を与えないほど〜", desc: "'~조차 허락하지 않을 만큼'. 빠른 귀환 = 옆방의 일이 가벼운 것이었음을 은연중 알림." },
    ],
    notes: [
      {
        title: "옆방의 일 = 대수롭지 않음",
        body: "선생님의 귀환이 너무 빨라 '무슨 일이냐'는 궁금증조차 피어오를 시간이 없음. 사모님이 부른 것은 일상적·소소한 일이었다는 암시 — 그럼에도 대화의 축은 완전히 끊긴다.",
      },
      {
        title: "장면의 회복과 단절",
        body: "선생님은 되돌아왔지만 이어 말하는 내용(563)은 자기 불신의 강도를 한 단계 더 높인다. 잠깐의 부재가 오히려 생각을 정리하는 시간이 된 듯한 인상.",
      },
    ],
    translations: {
      literal:
        "그것을 상상할 여유를 주지 않을 만큼 빠르게, 선생은 다시 좌식방으로 돌아왔다.",
      liberal:
        "내가 그 사정이 무엇인지 짐작해 볼 짬조차 주지 않을 만큼 빠른 걸음으로, 선생님은 이내 다시 사랑방으로 돌아와 앉으셨다.",
    },
  },
  {
    id: 563,
    paragraph: 14,
    original:
      "「とにかくあまり私を信用してはいけませんよ。今に後悔するから。そうして自分が欺あざむかれた返報に、残酷な復讐ふくしゅうをするようになるものだから」",
    hiragana: [
      h("「とにかくあまり ", false),
      h("わたくし", true), h("を ", false),
      h("しんよう", true), h("してはいけませんよ。 ", false),
      h("いま", true), h("に ", false),
      h("こうかい", true), h("するから。そうして ", false),
      h("じぶん", true), h("が ", false),
      h("あざむ", true), h("かれた ", false),
      h("へんぽう", true), h("に、 ", false),
      h("ざんこく", true), h("な ", false),
      h("ふくしゅう", true), h("をするようになるものだから」", false),
    ],
    meaning:
      "「어쨌든 나를 너무 믿어서는 안 되네. 머지않아 후회하게 될 테니까. 그러고는 자기가 속임당한 앙갚음으로, 잔혹한 복수를 하게 되기 마련이니까」",
    vocab: [
      V("とにかく", "とにかく", "어쨌든"),
      V("あまり", "あまり", "너무, 그다지"),
      V("私", "わたくし", "나"),
      V("信用", "しんよう", "신용"),
      V("今に", "いまに", "머지않아"),
      V("後悔", "こうかい", "후회"),
      V("自分", "じぶん", "자기"),
      V("欺く", "あざむく", "속이다"),
      V("返報", "へんぽう", "앙갚음"),
      V("残酷", "ざんこく", "잔혹"),
      V("復讐", "ふくしゅう", "복수"),
    ],
    grammar: [
      { element: "あまり〜してはいけません", desc: "'너무 ~해서는 안 된다'. 경고형. 배신 이전에 미리 거리를 두라는 선제적 경고." },
      { element: "今に〜から", desc: "'곧 ~할 것이니까'. 미래 확정의 단정." },
      {
        element: "欺かれた返報に",
        desc: "「欺く」 수동 + 「返報」(앙갚음). '속임을 당한 데 대한 앙갚음으로'. 사랑·신뢰의 배신이 복수로 전환되는 심리 도식.",
      },
      {
        element: "〜するようになるものだから",
        desc: "「〜ようになる」 변화 + 「ものだから」 근거. 인간의 본성이라는 일반론으로 포장된 개인적 경고.",
      },
    ],
    notes: [
      {
        title: "선생님 자신의 과거가 말하는 법칙",
        body: "이 문장이 무서운 이유 — 선생님은 자기 경험에서 나온 '법칙'을 일반론의 옷으로 입혀 화자에게 경고한다. 자기가 과거에 누군가를 배신했거나 배신당한 자리에 있었음을 간접적으로 드러냄.",
      },
      {
        title: "14단락의 결론부 — '복수'라는 단어의 출현",
        body: "12단락 「淋しい人間」 → 13단락 「恋は罪悪」 → 14단락 「残酷な復讐」. 점점 더 어두운 어휘로 자기를 규정하는 선생님의 독백의 정점. 『こころ』 후반의 K 서사가 곧 '선생님 자신의 잔혹한 복수'에 해당하게 된다는 구조적 예고.",
      },
      {
        title: "「今に後悔するから」",
        body: "화자에 대한 경고이자 선생님 자신의 과거 반영. '너도 언젠가 나를 믿은 것을 후회할 것이다'라는 체념과, '사람을 믿는다는 것' 자체의 위험성에 대한 일반화가 겹쳐 있다.",
      },
    ],
    translations: {
      literal:
        "「어쨌든 너무 나를 믿어서는 안 되네. 머지않아 후회할 테니까. 그러고는 자기가 속임당한 앙갚음으로, 잔혹한 복수를 하게 되기 마련이니까」",
      liberal:
        "「하여간 나를 그리 지나치게 믿어서는 안 되네. 언젠가는 반드시 후회하게 될 터이니까. 그리고 자네 스스로가 속아 넘어간 데 대한 앙갚음으로, 잔혹한 복수를 하게 되고 마는 법이니 말일세」",
    },
  },
];

for (const s of sentences) novel.push(s);

const p14 = paraMap.paragraphs.find((p) => p.paragraph === 14);
if (p14) p14.range = [538, 563];
else paraMap.paragraphs.push({ paragraph: 14, range: [538, 563] });

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2) + "\n", "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2) + "\n", "utf8");
writeFileSync(novelParaPath, JSON.stringify(paraMap, null, 2) + "\n", "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocab[lv], null, 2) + "\n", "utf8");
}

console.log("Added paragraph 14 sentences 556-563.");
console.log("New kanji:", Object.keys(newKanji).join(", "));
console.log("New vocab:");
for (const [k, v] of Object.entries(idx)) console.log(`  ${k} -> ${v.level}#${v.index}`);
