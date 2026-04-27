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

// ============ FIX: move entries 411-425 from paragraph 11 to paragraph 10 ============
let relabeled = 0;
for (const it of novel) {
  if (it.id >= 411 && it.id <= 425 && it.paragraph === 11) {
    it.paragraph = 10;
    relabeled++;
  }
}

// Remove paragraph 11 from map
paraMap.paragraphs = paraMap.paragraphs.filter((p) => p.paragraph !== 11);

// ============ NEW KANJI (10) ============
const newKanji = {
  "乗": {
    char: "乗", readings: { onyomi: ["ジョウ"], kunyomi: ["の.る", "の.せる"] },
    meanings: ["타다"], jlpt: "N5", grade: 3, strokes: 9,
    radicals: [{ char: "木", meaning: "나무", position: "bottom" }, { char: "禾", meaning: "벼이삭", position: "top" }],
    mnemonic: {
      radicalRoles: [{ char: "木", persona: "나무 사다리" }, { char: "禾", persona: "사람이 올라탄 이삭" }],
      story: "木(나무) 위에 禾(사람이 올라선 모양) — 무언가 위에 올라타다.",
      keyImage: "나무 위에 올라탐 = 타다",
    },
    examples: [
      { word: "乗る", reading: "のる", meaning: "타다" },
      { word: "乗車", reading: "じょうしゃ", meaning: "승차" },
    ],
  },
  "帆": {
    char: "帆", readings: { onyomi: ["ハン"], kunyomi: ["ほ"] },
    meanings: ["돛"], jlpt: "N1", grade: 9, strokes: 6,
    radicals: [{ char: "巾", meaning: "천", position: "left" }, { char: "凡", meaning: "무릇·평범", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "巾", persona: "펼쳐진 천" }, { char: "凡", persona: "바람을 받는 둥근 형" }],
      story: "巾(천)을 凡(바람 받는 형)으로 달아 — 돛.",
      keyImage: "바람을 받는 천 = 돛",
    },
    examples: [
      { word: "出帆", reading: "しゅっぱん", meaning: "출범, 출항" },
      { word: "帆船", reading: "はんせん", meaning: "범선" },
    ],
  },
  "朝": {
    char: "朝", readings: { onyomi: ["チョウ"], kunyomi: ["あさ"] },
    meanings: ["아침"], jlpt: "N5", grade: 2, strokes: 12,
    radicals: [
      { char: "十", meaning: "풀", position: "top-left" },
      { char: "日", meaning: "해", position: "middle" },
      { char: "月", meaning: "달", position: "right" },
    ],
    mnemonic: {
      radicalRoles: [
        { char: "日", persona: "떠오르는 해" },
        { char: "月", persona: "지는 달" },
      ],
      story: "日(해)와 月(달)이 함께 보이는 시간 — 아침.",
      keyImage: "해와 달이 교대하는 시간 = 아침",
    },
    examples: [
      { word: "朝", reading: "あさ", meaning: "아침" },
      { word: "朝食", reading: "ちょうしょく", meaning: "조식" },
    ],
  },
  "束": {
    char: "束", readings: { onyomi: ["ソク"], kunyomi: ["たば", "つか.ねる"] },
    meanings: ["묶음", "다발"], jlpt: "N3", grade: 4, strokes: 7,
    radicals: [{ char: "木", meaning: "나무", position: "all" }, { char: "口", meaning: "입·묶음", position: "middle" }],
    mnemonic: {
      radicalRoles: [{ char: "木", persona: "나뭇가지" }, { char: "口", persona: "묶는 띠" }],
      story: "木(나뭇가지)를 口(띠)로 묶은 모양 — 묶음, 다발. 약속(約束)의 '束'.",
      keyImage: "나뭇가지를 묶다 = 묶음",
    },
    examples: [
      { word: "約束", reading: "やくそく", meaning: "약속" },
      { word: "束ねる", reading: "たばねる", meaning: "묶다" },
    ],
  },
  "橋": {
    char: "橋", readings: { onyomi: ["キョウ"], kunyomi: ["はし"] },
    meanings: ["다리"], jlpt: "N5", grade: 3, strokes: 16,
    radicals: [{ char: "木", meaning: "나무", position: "left" }, { char: "喬", meaning: "높이 솟음", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "木", persona: "목재" }, { char: "喬", persona: "높이 걸친 형" }],
      story: "木(나무)로 喬(높이 걸쳐) 강을 건너게 한 — 다리.",
      keyImage: "높이 걸친 나무 = 다리",
    },
    examples: [
      { word: "橋", reading: "はし", meaning: "다리" },
      { word: "新橋", reading: "しんばし", meaning: "신바시 (도쿄 지명)" },
    ],
  },
  "汽": {
    char: "汽", readings: { onyomi: ["キ"], kunyomi: [] },
    meanings: ["김", "증기"], jlpt: "N3", grade: 2, strokes: 7,
    radicals: [{ char: "氵", meaning: "물", position: "left" }, { char: "气", meaning: "기운", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "氵", persona: "물" }, { char: "气", persona: "피어오르는 기운" }],
      story: "氵(물)이 气(기운)이 되어 피어오름 — 증기, 김.",
      keyImage: "물에서 피어오르는 기운 = 김",
    },
    examples: [
      { word: "汽車", reading: "きしゃ", meaning: "기차" },
      { word: "汽船", reading: "きせん", meaning: "기선" },
    ],
  },
  "礼": {
    char: "礼", readings: { onyomi: ["レイ", "ライ"], kunyomi: [] },
    meanings: ["예절", "감사"], jlpt: "N4", grade: 3, strokes: 5,
    radicals: [{ char: "礻", meaning: "제단", position: "left" }, { char: "乚", meaning: "휘감다·굽힘", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "礻", persona: "제단" }, { char: "乚", persona: "머리를 숙인 자세" }],
      story: "礻(제단) 앞에서 乚(머리를 숙인) 모습 — 예절, 인사, 감사.",
      keyImage: "제단 앞의 숙인 머리 = 예절",
    },
    examples: [
      { word: "礼義", reading: "れいぎ", meaning: "예의 (礼儀의 이체)" },
      { word: "礼", reading: "れい", meaning: "예, 감사" },
    ],
  },
  "船": {
    char: "船", readings: { onyomi: ["セン"], kunyomi: ["ふね", "ふな"] },
    meanings: ["배"], jlpt: "N5", grade: 2, strokes: 11,
    radicals: [{ char: "舟", meaning: "작은 배", position: "left" }, { char: "㕣", meaning: "늪·갈래", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "舟", persona: "나룻배" }, { char: "㕣", persona: "물길·갈래" }],
      story: "舟(작은 배)가 㕣(물길)을 따라 나아가는 모양 — 배, 선박.",
      keyImage: "물길을 가는 배 = 배",
    },
    examples: [
      { word: "船", reading: "ふね", meaning: "배" },
      { word: "汽船", reading: "きせん", meaning: "기선" },
    ],
  },
  "諾": {
    char: "諾", readings: { onyomi: ["ダク"], kunyomi: [] },
    meanings: ["승낙", "대답"], jlpt: "N2", grade: 9, strokes: 15,
    radicals: [{ char: "言", meaning: "말", position: "left" }, { char: "若", meaning: "같음·젊음", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "言", persona: "말" }, { char: "若", persona: "상대에게 '그러하다'는 응답" }],
      story: "言(말)로 若(그러하다)고 응답 — 승낙.",
      keyImage: "'그러하다'는 응답 = 승낙",
    },
    examples: [
      { word: "承諾", reading: "しょうだく", meaning: "승낙" },
      { word: "諾", reading: "だく", meaning: "승낙" },
    ],
  },
  "送": {
    char: "送", readings: { onyomi: ["ソウ"], kunyomi: ["おく.る"] },
    meanings: ["보내다"], jlpt: "N4", grade: 3, strokes: 9,
    radicals: [{ char: "辶", meaning: "길", position: "left" }, { char: "关", meaning: "두 손으로 들어 올림", position: "right" }],
    mnemonic: {
      radicalRoles: [{ char: "辶", persona: "길을 따라" }, { char: "关", persona: "두 손으로 전함" }],
      story: "辶(길)을 따라 关(두 손)으로 물건을 전달 — 보내다, 배웅하다.",
      keyImage: "길을 따라 손으로 전함 = 보내다",
    },
    examples: [
      { word: "送る", reading: "おくる", meaning: "보내다, 배웅하다" },
      { word: "放送", reading: "ほうそう", meaning: "방송" },
    ],
  },
};
for (const [ch, e] of Object.entries(newKanji)) if (!kanji[ch]) kanji[ch] = e;

// ============ NEW VOCAB (20) ============
const newVocab = {
  N5: [
    { kana: "のる", kanji: "乗る", meaning: "타다", pos: "동사" },
    { kana: "ふね", kanji: "船", meaning: "배", pos: "명사" },
    { kana: "おくる", kanji: "送る", meaning: "보내다, 배웅하다", pos: "동사" },
    { kana: "はちじはん", kanji: "八時半", meaning: "8시 반", pos: "명사" },
    { kana: "やくそく", kanji: "約束", meaning: "약속", pos: "명사·する동사" },
  ],
  N4: [
    { kana: "そのうち", kanji: "そのうち", meaning: "그 사이, 머잖아", pos: "부사" },
    { kana: "ゆうじん", kanji: "友人", meaning: "친구", pos: "명사" },
    { kana: "きしゃ", kanji: "汽車", meaning: "기차", pos: "명사" },
    { kana: "ぜんじつ", kanji: "前日", meaning: "전날", pos: "명사" },
    { kana: "のこす", kanji: "残す", meaning: "남기다", pos: "동사" },
  ],
  N3: [
    { kana: "であう", kanji: "出合う", meaning: "마주치다, 만나다 (出会う의 이체)", pos: "동사" },
    { kana: "きせん", kanji: "汽船", meaning: "기선", pos: "명사" },
    { kana: "できごと", kanji: "出来事", meaning: "사건, 일", pos: "명사" },
    { kana: "あらかじめ", kanji: "あらかじめ", meaning: "미리", pos: "부사" },
  ],
  N2: [
    { kana: "しょうだく", kanji: "承諾", meaning: "승낙", pos: "명사·する동사" },
    { kana: "こくべつ", kanji: "告別", meaning: "고별, 작별", pos: "명사·する동사" },
    { kana: "れいぎ", kanji: "礼義", meaning: "예의 (礼儀의 이체)", pos: "명사" },
  ],
  N1: [
    { kana: "さしむかい", kanji: "差向い", meaning: "마주 대함", pos: "명사" },
    { kana: "よこはま", kanji: "横浜", meaning: "요코하마 (지명)", pos: "명사·고유" },
    { kana: "しゅっぱん", kanji: "出帆", meaning: "출범, 출항", pos: "명사·する동사" },
    { kana: "しんばし", kanji: "新橋", meaning: "신바시 (도쿄 지명)", pos: "명사·고유" },
  ],
};
for (const [lv, words] of Object.entries(newVocab)) {
  const arr = vocabFiles[lv].words;
  for (const w of words) arr.push(w);
}

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

// ============ NEW NOVEL ENTRIES (7) — paragraph 10 ============
const newEntries = [
  {
    id: 426, paragraph: 10,
    original: "私はそのうち先生の留守に行って、奥さんと二人差向いで話をする機会に出合った。",
    hiragana: hira([
      ["わたくし", 1], ["はそのうち ", 0],
      ["せんせい", 1], ["の ", 0],
      ["るす", 1], ["に ", 0],
      ["い", 1], ["って、 ", 0],
      ["おく", 1], ["さんと ", 0],
      ["ふたり", 1], [" ", 0],
      ["さしむかい", 1], ["で ", 0],
      ["はなし", 1], ["をする ", 0],
      ["きかい", 1], ["に ", 0],
      ["であ", 1], ["った。", 0],
    ]),
    meaning: "나는 그 사이 선생님이 부재중일 때 찾아가, 사모님과 둘이 마주 앉아 이야기할 기회를 얻었다.",
    vocab: mv([
      ["私", "わたくし", "나"],
      ["そのうち", "そのうち", "그 사이, 머잖아"],
      ["先生", "せんせい", "선생님"],
      ["留守", "るす", "부재, 집을 비움"],
      ["奥さん", "おくさん", "사모님"],
      ["二人", "ふたり", "두 사람"],
      ["差向い", "さしむかい", "마주 대함"],
      ["話", "はなし", "이야기"],
      ["機会", "きかい", "기회"],
      ["出合う", "であう", "만나다, 마주치다"],
    ]),
    grammar: [
      { element: "そのうち", desc: "'머잖아, 그 사이'. 시간의 경과 중 한 지점을 막연히 지시하는 부사." },
      { element: "留守に行って", desc: "「留守」(부재)+「に行く」. '집이 비어 있을 때 찾아가다'. 보통 「留守中に行く」라고도 한다." },
      { element: "二人差向いで", desc: "「差向い」(마주 대함)+「で」. '둘이 마주 앉아'. 제3자 없는 일대일 장면을 지정하는 격식 있는 표현." },
      { element: "機会に出合った", desc: "「機会に出合う」(기회를 만나다) 관용. '기회를 얻었다'. 「出会う」가 아니라 「出合う」 옛 표기." },
    ],
    notes: [
      { title: "단락의 새 장면 설정", body: "선생님 부부의 소동(399~410), 선생님의 독백(411~425)에 이어, 이제 화자와 사모님의 일대일 대화로 초점이 이동. 단락 10 안에서 이야기의 시점이 세 번 전환되는 구조." },
      { title: "「留守」의 기능", body: "선생님이 없는 틈이 곧 화자와 사모님의 대화 공간을 연다. 선생님을 통해 간접적으로만 듣던 '부부 관계'를 사모님 본인에게 직접 듣게 되는 무대 전환의 핵심." },
    ],
  },
  {
    id: 427, paragraph: 10,
    original: "先生はその日横浜を出帆する汽船に乗って外国へ行くべき友人を新橋へ送りに行って留守であった。",
    hiragana: hira([
      ["せんせい", 1], ["はその ", 0],
      ["ひ", 1], [" ", 0],
      ["よこはま", 1], ["を ", 0],
      ["しゅっぱん", 1], ["する ", 0],
      ["きせん", 1], ["に ", 0],
      ["の", 1], ["って ", 0],
      ["がいこく", 1], ["へ ", 0],
      ["い", 1], ["くべき ", 0],
      ["ゆうじん", 1], ["を ", 0],
      ["しんばし", 1], ["へ ", 0],
      ["おく", 1], ["りに ", 0],
      ["い", 1], ["って ", 0],
      ["るす", 1], ["であった。", 0],
    ]),
    meaning: "선생님은 그날 요코하마에서 출항하는 기선을 타고 외국으로 갈 친구를 신바시까지 배웅하러 가서 집을 비운 상태였다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["横浜", "よこはま", "요코하마"],
      ["出帆", "しゅっぱん", "출범, 출항"],
      ["汽船", "きせん", "기선"],
      ["乗る", "のる", "타다"],
      ["外国", "がいこく", "외국"],
      ["行く", "いく", "가다"],
      ["友人", "ゆうじん", "친구"],
      ["新橋", "しんばし", "신바시"],
      ["送る", "おくる", "배웅하다"],
      ["留守", "るす", "부재"],
    ]),
    grammar: [
      { element: "横浜を出帆する汽船に乗って", desc: "「横浜を出帆する」(요코하마를 출항하는) 연체수식 + 「汽船に乗って」. 친구의 여정을 겹겹이 수식으로 풀어내는 긴 한 문장." },
      { element: "外国へ行くべき友人", desc: "「行くべき」(가야 할) + 「友人」. 「べき」의 당위·예정 의미. '외국에 갈 예정인 친구'." },
      { element: "送りに行って留守であった", desc: "「送りに行く」(배웅하러 가다) + 「留守であった」. 부재의 이유를 한 절로 정리." },
    ],
    notes: [
      { title: "부재의 이유 설명", body: "426에서 '선생님이 집을 비웠다'고 한 것을 427에서 자세히 풀어낸다. 메이지 시대의 외국행 배웅 장면 — 횡빈(요코하마) 출항, 신바시역 배웅 — 이 서술이 곧 시대의 풍경을 전달." },
      { title: "긴 수식의 일본어 구조", body: "한 문장 안에 '요코하마 출항 → 기선 승선 → 외국행 → 친구 → 신바시 배웅 → 부재'가 연쇄적으로 얽힘. 한국어로 풀면 여러 절로 나뉘지만 일본어에선 연체수식으로 압축된다. 근대 일본어 장문의 전형." },
    ],
  },
  {
    id: 428, paragraph: 10,
    original: "横浜から船に乗る人が、朝八時半の汽車で新橋を立つのはその頃の習慣であった。",
    hiragana: hira([
      ["よこはま", 1], ["から ", 0],
      ["ふね", 1], ["に ", 0],
      ["の", 1], ["る ", 0],
      ["ひと", 1], ["が、 ", 0],
      ["あさ", 1], [" ", 0],
      ["はちじはん", 1], ["の ", 0],
      ["きしゃ", 1], ["で ", 0],
      ["しんばし", 1], ["を ", 0],
      ["た", 1], ["つのはその ", 0],
      ["ころ", 1], ["の ", 0],
      ["しゅうかん", 1], ["であった。", 0],
    ]),
    meaning: "요코하마에서 배를 타는 사람이 아침 8시 반 기차로 신바시를 출발하는 것이, 그 무렵의 관례였다.",
    vocab: mv([
      ["横浜", "よこはま", "요코하마"],
      ["船", "ふね", "배"],
      ["乗る", "のる", "타다"],
      ["人", "ひと", "사람"],
      ["朝", "あさ", "아침"],
      ["八時半", "はちじはん", "8시 반"],
      ["汽車", "きしゃ", "기차"],
      ["新橋", "しんばし", "신바시"],
      ["立つ", "たつ", "출발하다"],
      ["頃", "ころ", "무렵"],
      ["習慣", "しゅうかん", "습관, 관례"],
    ]),
    grammar: [
      { element: "〜のは〜であった", desc: "「〜のは」(~하는 것은) + 「〜であった」. 주제·설명 구문. 'X가 Y였다'라는 일반론적 서술." },
      { element: "新橋を立つ", desc: "「立つ」가 '출발하다'의 의미. 「場所を立つ」는 문어체 관용 — '그 장소에서 출발하다'." },
      { element: "その頃の習慣", desc: "'그 무렵의 관례'. 당시의 보편적 양식임을 명시. 독자에게 시대 배경을 알리는 서술자의 주석." },
    ],
    notes: [
      { title: "서술자의 주석", body: "소설 내 등장인물 장면을 잠시 멈추고, 서술자(회고 중인 화자)가 당시의 관례를 독자에게 설명. 메이지 말~다이쇼 초의 교통 풍속(요코하마 출항 — 아침 기차로 신바시 경유)을 기록하는 사회사적 한 줄." },
      { title: "시간 배경의 구체화", body: "'아침 8시 반 기차'. 구체적 시각이 장면에 생활감을 준다. 막연한 '아침'이 아니라 정확한 출발 시간 — 선생님의 행동(그 시각 신바시 역 도착)과 429에서 화자의 '약속의 9시' 방문이 시간적으로 맞물림." },
    ],
  },
  {
    id: 429, paragraph: 10,
    original: "私はある書物について先生に話してもらう必要があったので、あらかじめ先生の承諾を得た通り、約束の九時に訪問した。",
    hiragana: hira([
      ["わたくし", 1], ["はある ", 0],
      ["しょもつ", 1], ["について ", 0],
      ["せんせい", 1], ["に ", 0],
      ["はな", 1], ["してもらう ", 0],
      ["ひつよう", 1], ["があったので、あらかじめ ", 0],
      ["せんせい", 1], ["の ", 0],
      ["しょうだく", 1], ["を ", 0],
      ["え", 1], ["た ", 0],
      ["とお", 1], ["り、 ", 0],
      ["やくそく", 1], ["の ", 0],
      ["くじ", 1], ["に ", 0],
      ["ほうもん", 1], ["した。", 0],
    ]),
    meaning: "나는 어떤 책에 대해 선생님께 이야기를 들을 필요가 있어서, 미리 선생님의 승낙을 얻은 대로 약속된 9시에 방문했다.",
    vocab: mv([
      ["私", "わたくし", "나"],
      ["書物", "しょもつ", "책"],
      ["先生", "せんせい", "선생님"],
      ["話す", "はなす", "이야기하다"],
      ["必要", "ひつよう", "필요"],
      ["あらかじめ", "あらかじめ", "미리"],
      ["承諾", "しょうだく", "승낙"],
      ["得る", "える", "얻다"],
      ["通り", "とおり", "~대로"],
      ["約束", "やくそく", "약속"],
      ["九時", "くじ", "9시"],
      ["訪問", "ほうもん", "방문"],
    ]),
    grammar: [
      { element: "〜について話してもらう必要があった", desc: "「〜について」(~에 대해) + 「話してもらう」(말해 주기를 받다) + 「必要がある」의 과거. '들을 필요가 있었다'는 완곡 표현." },
      { element: "承諾を得た通り", desc: "「〜た通り」(~한 대로). '승낙을 얻은 그대로'. 사전 약속을 지킨 행동임을 명시." },
      { element: "約束の九時に訪問した", desc: "「約束の〜」(약속된 ~) + 「訪問する」. 약속한 정확한 시간의 방문임을 강조 — 다음 문장에서 선생님의 부재가 '예외적'이었음을 준비하는 포석." },
    ],
    notes: [
      { title: "방문의 정당성", body: "화자가 미리 약속을 얻었고 약속 시간에 정확히 왔다는 점을 강조. '왜 집에 있었는데 선생님이 없나' 하는 의아함의 해명이자, 다음 430번에서 설명될 '선생님의 갑작스러운 배웅'의 이유를 논리적으로 준비." },
      { title: "책 이야기라는 핑계", body: "본격적인 이유가 '책'이라는 건조한 구실. 소세키 소설에서 '책 이야기'는 지식인 사이의 교류를 중재하는 전형적 매개. 배움을 구실로 인간적 거리를 좁히는 화자의 방식." },
    ],
  },
  {
    id: 430, paragraph: 10,
    original: "先生の新橋行きは前日わざわざ告別に来た友人に対する礼義としてその日突然起った出来事であった。",
    hiragana: hira([
      ["せんせい", 1], ["の ", 0],
      ["しんばし", 1], [" ", 0],
      ["ゆ", 1], ["きは ", 0],
      ["ぜんじつ", 1], ["わざわざ ", 0],
      ["こくべつ", 1], ["に ", 0],
      ["き", 1], ["た ", 0],
      ["ゆうじん", 1], ["に ", 0],
      ["たい", 1], ["する ", 0],
      ["れいぎ", 1], ["としてその ", 0],
      ["ひ", 1], [" ", 0],
      ["とつぜん", 1], [" ", 0],
      ["おこ", 1], ["った ", 0],
      ["できごと", 1], ["であった。", 0],
    ]),
    meaning: "선생님의 신바시 행은 전날 일부러 작별을 고하러 온 친구에 대한 예의로서 그날 갑자기 벌어진 일이었다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["新橋", "しんばし", "신바시"],
      ["行く", "いく", "가다"],
      ["前日", "ぜんじつ", "전날"],
      ["告別", "こくべつ", "고별, 작별"],
      ["来る", "くる", "오다"],
      ["友人", "ゆうじん", "친구"],
      ["対する", "たいする", "~에 대하다"],
      ["礼義", "れいぎ", "예의"],
      ["突然", "とつぜん", "갑자기"],
      ["起る", "おこる", "일어나다"],
      ["出来事", "できごと", "사건"],
    ]),
    grammar: [
      { element: "わざわざ告別に来た", desc: "「わざわざ」(일부러) + 「告別に来る」의 과거. '일부러 작별을 고하러 왔다'. 친구의 성의를 강조하며 선생님의 답례가 당연함을 준비." },
      { element: "〜に対する礼義として", desc: "「〜に対する」(~에 대한) + 「礼義として」(예의로서). '~에 대한 예의로'. 행동의 윤리적 동기를 명시." },
      { element: "その日突然起った出来事", desc: "「その日」(그날) + 「突然」(갑자기) + 「起った出来事」(일어난 일). '사전에 예정되지 않은 갑작스러운 일'. 429의 '약속의 9시'에 맞춰 왔는데 왜 선생님이 없었는지의 해명." },
    ],
    notes: [
      { title: "약속 위반의 해명", body: "선생님은 약속을 지키지 않은 게 아니라, 예의상 피할 수 없는 갑작스러운 사정이 있었음을 서술자가 공들여 설명. 선생님에 대한 화자의 변호이자, 선생님의 성격(약속과 예의를 모두 지키려는)의 간접 묘사." },
      { title: "「礼義」의 옛 표기", body: "현대는 「礼儀」. 메이지 말까지는 「義」를 쓰는 표기도 통용. 소세키의 옛 표기법 선택이 작품의 시대감을 지탱." },
    ],
  },
  {
    id: 431, paragraph: 10,
    original: "先生はすぐ帰るから留守でも私に待っているようにといい残して行った。",
    hiragana: hira([
      ["せんせい", 1], ["はすぐ ", 0],
      ["かえ", 1], ["るから ", 0],
      ["るす", 1], ["でも ", 0],
      ["わたくし", 1], ["に ", 0],
      ["ま", 1], ["っているようにと ", 0],
      ["い", 1], ["い ", 0],
      ["のこ", 1], ["して ", 0],
      ["い", 1], ["った。", 0],
    ]),
    meaning: "선생님은 곧 돌아올 테니 집을 비운 동안이라도 나에게 기다리고 있으라고 말을 남기고 갔다.",
    vocab: mv([
      ["先生", "せんせい", "선생님"],
      ["帰る", "かえる", "돌아오다"],
      ["留守", "るす", "부재"],
      ["私", "わたくし", "나"],
      ["待つ", "まつ", "기다리다"],
      ["残す", "のこす", "남기다"],
      ["行く", "いく", "가다"],
    ]),
    grammar: [
      { element: "すぐ帰るから〜ように", desc: "「すぐ帰る」+「から」(이유) + 「ように」(간접명령/지시). '곧 돌아올 테니 ~하도록'. 간접 인용을 통한 명령 전달." },
      { element: "留守でも〜待っている", desc: "「留守でも」(집을 비워도) + 「待っている」. '부재 중이라도 기다리고 있으라'." },
      { element: "いい残して行った", desc: "「言い残す」(말을 남기다) + 「て行く」. '남기고 갔다'. 떠나면서 지시한 말이라는 시간적 순서가 한 동사구에 응축." },
    ],
    notes: [
      { title: "선생님의 배려", body: "약속을 어길 수 없었던 선생님이 화자를 위해 남긴 한 마디. 자기 사정으로 비었어도 화자의 방문 약속은 소홀히 하지 않겠다는 세심함 — 같은 단락 410 「妻君のために」와 같은 결의 배려가 여기서도 이어진다." },
      { title: "「留守でも〜ように」의 간접 화법", body: "선생님이 직접 말한 대사가 아니라 서술자가 간접 인용. 화자가 선생님의 당부를 받아들인 자리에서 글을 쓰고 있다는 거리감." },
    ],
  },
  {
    id: 432, paragraph: 10,
    original: "それで私は座敷へ上がって、先生を待つ間、奥さんと話をした。",
    hiragana: hira([
      ["それで ", 0],
      ["わたくし", 1], ["は ", 0],
      ["ざしき", 1], ["へ ", 0],
      ["あ", 1], ["がって、 ", 0],
      ["せんせい", 1], ["を ", 0],
      ["ま", 1], ["つ ", 0],
      ["あいだ", 1], ["、 ", 0],
      ["おく", 1], ["さんと ", 0],
      ["はなし", 1], ["をした。", 0],
    ]),
    meaning: "그래서 나는 다다미방으로 올라가, 선생님을 기다리는 동안 사모님과 이야기를 나누었다.",
    vocab: mv([
      ["私", "わたくし", "나"],
      ["座敷", "ざしき", "다다미방"],
      ["上がる", "あがる", "올라가다"],
      ["先生", "せんせい", "선생님"],
      ["待つ", "まつ", "기다리다"],
      ["間", "あいだ", "동안"],
      ["奥さん", "おくさん", "사모님"],
      ["話", "はなし", "이야기"],
    ]),
    grammar: [
      { element: "座敷へ上がって", desc: "「座敷」(다다미방) + 「へ上がる」의 て형. 일본 가옥에서 신발을 벗고 다다미 위로 올라가는 동작 — 집 안으로 들어감을 뜻하는 관용." },
      { element: "先生を待つ間、奥さんと話をした", desc: "「〜間」(~동안) + 주절. '기다리는 동안 이야기를 했다'. 시간의 한 덩어리 안에서 일어난 부차적 행위." },
    ],
    notes: [
      { title: "장면의 완성", body: "426~431이 '왜 이런 장면이 가능해졌는가'의 설명이었다면, 432는 그 모든 조건이 맞물려 비로소 성사된 장면. 화자와 사모님의 단둘이의 대화는 다음 단락부터 본격적으로 펼쳐질 새 국면의 서막." },
      { title: "「待つ間」의 이중 의미", body: "표면적으로는 '선생님을 기다리는 시간'. 이야기 구조적으로는 '선생님이 없는 동안에만 가능한 대화'의 공간. 단락 10 후반부가 열어 놓은, 선생님의 부재가 만드는 새 관계의 가능성." },
    ],
  },
];

const existingIds = new Set(novel.map((it) => it.id));
let added = 0;
for (const e of newEntries) {
  if (existingIds.has(e.id)) { console.warn(`Skip: ${e.id} exists`); continue; }
  novel.push(e); added++;
}
novel.sort((a, b) => a.id - b.id);

// Update paragraph 10 range to cover all new IDs
const p10 = paraMap.paragraphs.find((p) => p.paragraph === 10);
if (p10) {
  p10.range[0] = Math.min(p10.range[0], 399);
  p10.range[1] = Math.max(p10.range[1], 432);
}

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
}
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Relabeled ${relabeled} entries (411-425) from p11 → p10`);
console.log(`✓ Removed paragraph 11 from paragraph map`);
console.log(`✓ Added ${added} new entries (426-${426 + added - 1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji`);
let vs = 0;
for (const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added ${vs} vocab entries`);
console.log(`✓ Paragraph 10 range: [${p10.range[0]}, ${p10.range[1]}]`);
