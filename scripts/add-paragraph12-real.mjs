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
for (const lv of ["N5","N4","N3","N2","N1"]) vocabFiles[lv] = JSON.parse(readFileSync(vocabPath(lv), "utf8"));

const nk = (char, on, kun, mean, jlpt, grade, strokes, rads, story, keyImage, examples) => ({
  char, readings: { onyomi: on, kunyomi: kun }, meanings: mean, jlpt, grade, strokes,
  radicals: rads.map(([c,m,p])=>({char:c,meaning:m,position:p})),
  mnemonic: { radicalRoles: rads.map(([c,m])=>({char:c,persona:m})), story, keyImage },
  examples,
});

const newKanji = {
  "冗": nk("冗",["ジョウ"],[],["쓸데없다","넘치다"],"N2",9,4,
    [["冖","덮개","top"],["儿","사람","bottom"]],
    "冖(덮개) 아래 儿(사람)이 우두커니 앉아 있음 — 쓸데없음, 잉여.",
    "덮개 아래 한가로운 사람 = 쓸데없음",
    [{word:"冗談",reading:"じょうだん",meaning:"농담"}]),
  "市": nk("市",["シ"],["いち"],["시장","도시"],"N4",2,5,
    [["亠","덮개","top"],["巾","천·깃발","bottom"]],
    "亠(지붕) 아래 巾(천·깃발)이 늘어선 모양 — 장이 서는 자리, 시장, 도시.",
    "깃발 늘어선 장 = 시장",
    [{word:"市ヶ谷",reading:"いちがや",meaning:"이치가야 (도쿄 지명)"},{word:"都市",reading:"とし",meaning:"도시"}]),
  "江": nk("江",["コウ"],["え"],["강"],"N3",4,6,
    [["氵","물","left"],["工","만들다·곧음","right"]],
    "氵(물)이 工(곧게) 흐르는 큰 강 — 특히 바다에 가까운 하구·에도(江戸) 같은 지명.",
    "곧게 흐르는 큰 강 = 에도(江戸)",
    [{word:"江戸",reading:"えど",meaning:"에도 (도쿄 옛 이름)"}]),
  "潟": nk("潟",["ガタ"],["かた"],["개펄","호수"],"N1",9,15,
    [["氵","물","left"],["舄","까치·벗겨진 자리","right"]],
    "氵(물)이 舄(벗겨진 듯 드러난 자리)로 물러나 이룬 개펄 — 석호·간석지.",
    "물이 물러난 자리 = 개펄",
    [{word:"新潟",reading:"にいがた",meaning:"니가타"}]),
  "県": nk("県",["ケン"],[],["현 (행정 구역)","매달다"],"N3",3,9,
    [["目","눈","top"],["小","작은 장식","bottom"]],
    "目(눈)에 小(작은 장식)이 달린 모양 — 매달려 있는 곳의 파생으로 '현(일본의 행정 구역)'.",
    "매달린 것 = 현",
    [{word:"県人",reading:"けんじん",meaning:"현민, 같은 현 출신자"},{word:"新潟県",reading:"にいがたけん",meaning:"니가타현"}]),
  "里": nk("里",["リ"],["さと"],["마을","고향"],"N3",2,7,
    [["田","밭","top"],["土","흙","bottom"]],
    "田(밭)과 土(흙)이 합쳐진 모양 — 사람이 살고 밭을 가꾸는 곳 = 마을, 고향.",
    "밭과 흙이 있는 곳 = 마을",
    [{word:"郷里",reading:"きょうり",meaning:"고향"}]),
};
for (const [ch,e] of Object.entries(newKanji)) if(!kanji[ch]) kanji[ch]=e;

const newVocab = {
  N5: [
    { kana:"おかあさん", kanji:"母さん", meaning:"어머니", pos:"명사" },
  ],
  N4: [
    { kana:"ちちおや", kanji:"父親", meaning:"아버지", pos:"명사" },
    { kana:"じょうだん", kanji:"冗談", meaning:"농담", pos:"명사" },
    { kana:"ちがい", kanji:"違い", meaning:"차이", pos:"명사" },
  ],
  N3: [],
  N2: [
    { kana:"かつて", kanji:"かつて", meaning:"일찍이, 예전에", pos:"부사" },
    { kana:"で", kanji:"出", meaning:"출신, 출처", pos:"명사" },
    { kana:"えど", kanji:"江戸", meaning:"에도 (도쿄의 옛 이름)", pos:"명사·고유" },
    { kana:"けんじん", kanji:"県人", meaning:"현 출신자", pos:"명사" },
    { kana:"きょうり", kanji:"郷里", meaning:"고향", pos:"명사" },
  ],
  N1: [
    { kana:"あいのこ", kanji:"合いの子", meaning:"혼혈, 두 지역의 결합 (옛 표현)", pos:"명사" },
    { kana:"とっとり", kanji:"鳥取", meaning:"돗토리 (지명)", pos:"명사·고유" },
    { kana:"いちがや", kanji:"市ヶ谷", meaning:"이치가야 (도쿄 지명)", pos:"명사·고유" },
    { kana:"にいがた", kanji:"新潟", meaning:"니가타 (지명)", pos:"명사·고유" },
  ],
};
for (const [lv,words] of Object.entries(newVocab))
  for (const w of words) vocabFiles[lv].words.push(w);

const vIdx = new Map();
for (const lv of ["N5","N4","N3","N2","N1"]) {
  vocabFiles[lv].words.forEach((w,i)=>{
    const key = `${w.kanji ?? w.kana}|${w.kana}`;
    if(!vIdx.has(key)) vIdx.set(key,{level:lv,index:i});
  });
}
function vref(k,r){ return vIdx.get(`${k}|${r}`); }
function mv(items){
  return items.map(([k,r,m])=>{
    const ref=vref(k,r);
    return ref ? {kanji:k,reading:r,meaning:m,ref} : {kanji:k,reading:r,meaning:m};
  });
}
function hira(parts){ return parts.map(([t,e])=>({t,e:!!e})); }

const newEntries = [
  {
    id: 473, paragraph: 12,
    original: "奥さんは東京の人であった。それはかつて先生からも奥さん自身からも聞いて知っていた。",
    hiragana: hira([
      ["おく",1],["さんは ",0],
      ["とうきょう",1],["の ",0],
      ["ひと",1],["であった。それはかつて ",0],
      ["せんせい",1],["からも ",0],
      ["おく",1],["さん ",0],
      ["じしん",1],["からも ",0],
      ["き",1],["いて ",0],
      ["し",1],["っていた。",0],
    ]),
    meaning: "사모님은 도쿄 사람이었다. 그것은 예전에 선생님에게서도 사모님 자신에게서도 들어 알고 있었다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["東京","とうきょう","도쿄"],
      ["人","ひと","사람"],
      ["かつて","かつて","예전에"],
      ["先生","せんせい","선생님"],
      ["自身","じしん","자신"],
      ["聞く","きく","듣다"],
      ["知る","しる","알다"],
    ]),
    grammar: [
      { element:"〜からも〜からも", desc:"「〜から」(~에게서) + 「も」의 반복. '~에게서도 ~에게서도'. 양쪽에서 들었다는 정보원 두 겹을 병렬로 제시." },
      { element:"聞いて知っていた", desc:"「聞く」의 て형 + 「知っている」의 과거. '들어서 알고 있었다'. 인지의 경로(들음)와 상태(앎)를 하나로 이음." },
    ],
    notes: [
      { title:"단락의 도입", body:"11단락 끝에 사모님이 말하려 하지 않은 '서생 시절' 이야기를 잇는 대신, 서술자는 한 발 물러서서 사모님의 출신을 객관적으로 소개. 직접 화제를 밀고 가지 않고 배경 정보로 우회하는 도입." },
      { title:"두 짧은 문장의 결합", body:"첫째 문장은 사실 선언, 둘째 문장은 그 사실의 출처. 11단락 441의 '先生は大学出身であった。これは始めから私に知れていた。'와 같은 구조 — 서술자가 자기 정보원을 짧게 덧붙이는 전형적 결합." },
    ],
  },
  {
    id: 474, paragraph: 12,
    original: "奥さんは「本当いうと合いの子なんですよ」といった。",
    hiragana: hira([
      ["おく",1],["さんは「 ",0],
      ["ほんとう",1],["いうと ",0],
      ["あいのこ",1],["なんですよ」といった。",0],
    ]),
    meaning: "사모님은 \"사실대로 말하자면 혼혈이에요\"라고 말했다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["本当","ほんとう","정말, 사실"],
      ["合いの子","あいのこ","혼혈, 두 지역의 결합"],
    ]),
    grammar: [
      { element:"本当いうと", desc:"「本当(のところを)いうと」의 회화 축약. '사실대로 말하자면'. 이야기를 한 단계 깊이 트는 전환 표지." },
      { element:"合いの子なんですよ", desc:"「合いの子」(섞인 아이) + 「なんです」(설명) + 「よ」(알림). 가벼운 자기 폭로의 어조." },
    ],
    notes: [
      { title:"「合いの子」의 뉘앙스", body:"현대에는 주로 혼혈아를 가리키지만, 메이지 문맥에선 '두 지역·두 계통이 섞인 사람'을 가볍게 부르는 말. 다음 475에서 부모의 출신이 다른 지역임을 말할 것을 예고." },
      { title:"친근한 자기 노출", body:"473의 '도쿄 사람'이라는 단정을 사모님 스스로 뒤집는 모양새. 공식적 정체성(도쿄인) 뒤의 개인사를 농담 섞어 드러내는 어투." },
    ],
  },
  {
    id: 475, paragraph: 12,
    original: "奥さんの父親はたしか鳥取かどこかの出であるのに、お母さんの方はまだ江戸といった時分の市ヶ谷で生れた女なので、奥さんは冗談半分そういったのである。",
    hiragana: hira([
      ["おく",1],["さんの ",0],
      ["ちちおや",1],["はたしか ",0],
      ["とっとり",1],["かどこかの ",0],
      ["で",1],["であるのに、お ",0],
      ["かあ",1],["さんの ",0],
      ["ほう",1],["はまだ ",0],
      ["えど",1],["といった ",0],
      ["じぶん",1],["の ",0],
      ["いちがや",1],["で ",0],
      ["うま",1],["れた ",0],
      ["おんな",1],["なので、 ",0],
      ["おく",1],["さんは ",0],
      ["じょうだん",1],[" ",0],
      ["はんぶん",1],["そういったのである。",0],
    ]),
    meaning: "사모님의 아버지는 아마 돗토리인가 어딘가 출신이었고, 어머니 쪽은 아직 '에도'라고 부르던 시절의 이치가야에서 태어난 여자였기 때문에, 사모님은 농담 반쯤으로 그리 말한 것이다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["父親","ちちおや","아버지"],
      ["鳥取","とっとり","돗토리 (지명)"],
      ["出","で","출신"],
      ["母さん","おかあさん","어머니"],
      ["方","ほう","쪽"],
      ["江戸","えど","에도"],
      ["時分","じぶん","시절"],
      ["市ヶ谷","いちがや","이치가야"],
      ["生れる","うまれる","태어나다"],
      ["女","おんな","여자"],
      ["冗談","じょうだん","농담"],
      ["半分","はんぶん","반, 반쯤"],
    ]),
    grammar: [
      { element:"たしか〜かどこか", desc:"「たしか」(아마) + 「〜かどこか」(~인지 어딘지). 정확히 기억나지 않음을 부사와 불확정 접미사로 이중 완화." },
      { element:"まだ江戸といった時分の", desc:"「まだ」(아직) + 「江戸といった」(에도라고 하던) + 「時分の」(시절의). '아직 도쿄를 에도라고 부르던 무렵의'. 장소명에 시간 의미가 실리는 이중 수식." },
      { element:"冗談半分そういった", desc:"「冗談半分」(농담 반) + 「そういった」. '농담 반쯤으로 그렇게 말했다'. 474의 「合いの子」 발언이 온전한 진담이 아닌 가벼운 자조였음을 밝힘." },
    ],
    notes: [
      { title:"서술자의 긴 해설", body:"474의 짧은 사모님 발언 한 문장 뒤에 곧장 한 문장으로 된 긴 해설이 이어진다. 독자에게 사모님의 농담을 이해시키기 위한 배경 설명 — 부모의 출신, 시대, 장소가 모두 한 문장에 녹아든다." },
      { title:"「江戸といった時分」의 시간감", body:"도쿄가 아직 에도라 불리던 메이지 이전(1868년 이전). 어머니가 태어난 시대를 암시해 사모님 집안의 역사가 메이지 전의 도시 전통에 닿아 있음을 드러낸다. 소설의 시간 좌표가 선생님 세대가 아닌 그 부모 세대까지 확장." },
    ],
  },
  {
    id: 476, paragraph: 12,
    original: "ところが先生は全く方角違いの新潟県人であった。",
    hiragana: hira([
      ["ところが ",0],
      ["せんせい",1],["は ",0],
      ["まった",1],["く ",0],
      ["ほうがく",1],[" ",0],
      ["ちが",1],["いの ",0],
      ["にいがた",1],[" ",0],
      ["けんじん",1],["であった。",0],
    ]),
    meaning: "그런데 선생님은 전혀 다른 방향의 니가타현 사람이었다.",
    vocab: mv([
      ["先生","せんせい","선생님"],
      ["全く","まったく","전혀, 완전히"],
      ["方角","ほうがく","방향"],
      ["違い","ちがい","차이"],
      ["新潟","にいがた","니가타"],
      ["県人","けんじん","현 출신자"],
    ]),
    grammar: [
      { element:"ところが", desc:"'그런데'. 역접. 앞 문장(사모님의 가족 지리)과 대조되는 선생님의 출신을 꺼낸다." },
      { element:"全く方角違いの", desc:"「全く」(전혀) + 「方角違い」(방향이 다름) + 「の」. '전혀 방향이 다른'. 지리적 격차를 강조해 두 사람이 출신에서 만날 수 없는 거리였음을 지시." },
    ],
    notes: [
      { title:"두 출신의 대조", body:"사모님=도쿄(+돗토리 혈통), 선생님=니가타. 서로 다른 지역 기반을 대비시켜 '서생 시절부터의 만남'이 지역적 인연에서 시작된 게 아님을 준비. 다음 477의 논리 전개를 위한 기초 정보." },
    ],
  },
  {
    id: 477, paragraph: 12,
    original: "だから奥さんがもし先生の書生時代を知っているとすれば、郷里の関係からでない事は明らかであった。",
    hiragana: hira([
      ["だから ",0],
      ["おく",1],["さんがもし ",0],
      ["せんせい",1],["の ",0],
      ["しょせい",1],[" ",0],
      ["じだい",1],["を ",0],
      ["し",1],["っているとすれば、 ",0],
      ["きょうり",1],["の ",0],
      ["かんけい",1],["からでない ",0],
      ["こと",1],["は ",0],
      ["あき",1],["らかであった。",0],
    ]),
    meaning: "따라서 사모님이 만약 선생님의 서생 시절을 알고 있다면, 그것이 고향의 인연에서 비롯된 것은 아님이 분명했다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["先生","せんせい","선생님"],
      ["書生","しょせい","서생"],
      ["時代","じだい","시대"],
      ["知る","しる","알다"],
      ["郷里","きょうり","고향"],
      ["関係","かんけい","관계"],
      ["事","こと","일"],
      ["明らか","あきらか","명확함"],
    ]),
    grammar: [
      { element:"もし〜とすれば", desc:"「もし」(만약) + 「〜とすれば」(~라고 한다면). 가정 조건. 아직 확인되지 않은 사실을 논리로 따져 보는 구문." },
      { element:"〜からでない事は明らかであった", desc:"「〜からでない」(~에서 비롯된 것이 아닌) + 「事は明らかであった」(~임은 명백했다). 부정의 귀결을 '분명함'으로 단정." },
    ],
    notes: [
      { title:"추리 서술", body:"화자가 두 사람의 출신을 비교해 '고향 인연'이 아니라는 결론을 논리적으로 도출. 직접 묻지 않고 스스로 사유하는 서술자의 추리. 11단락 421의 '왜 행복하다고 단언하지 않고 단서를 두는가' 같은 결론 유도와 같은 결." },
      { title:"남은 가능성", body:"'고향이 아니면 무엇인가' — 답은 단락 안에서 열리지 않고 독자의 상상에 맡긴다. 472의 사모님이 말하려 하지 않은 그 과거가 여전히 미지의 영역으로 남음." },
    ],
  },
  {
    id: 478, paragraph: 12,
    original: "しかし薄赤い顔をした奥さんはそれより以上の話をしたくないようだったので、私の方でも深くは聞かずにおいた。",
    hiragana: hira([
      ["しかし ",0],
      ["うすあか",1],["い ",0],
      ["かお",1],["をした ",0],
      ["おく",1],["さんはそれより ",0],
      ["いじょう",1],["の ",0],
      ["はなし",1],["をしたくないようだったので、 ",0],
      ["わたくし",1],["の ",0],
      ["ほう",1],["でも ",0],
      ["ふか",1],["くは ",0],
      ["き",1],["かずにおいた。",0],
    ]),
    meaning: "그러나 엷게 붉어진 얼굴의 사모님은 그 이상의 이야기를 하고 싶지 않은 듯 보였기에, 나도 굳이 깊이 캐묻지는 않았다.",
    vocab: mv([
      ["薄赤い","うすあかい","엷게 붉다"],
      ["顔","かお","얼굴"],
      ["奥さん","おくさん","사모님"],
      ["以上","いじょう","이상"],
      ["話","はなし","이야기"],
      ["私","わたくし","나"],
      ["方","ほう","쪽"],
      ["深い","ふかい","깊다"],
      ["聞く","きく","묻다"],
    ]),
    grammar: [
      { element:"薄赤い顔をした〜", desc:"11단락 472의 「急に薄赤い顔をした」를 받아 수식어로 활용. 같은 상태를 끌어와 이야기의 물리적 연속을 강조." },
      { element:"それより以上の話をしたくないようだった", desc:"「それより以上」(그 이상) + 「〜たくない」(~하고 싶지 않다) + 「ようだ」(~인 듯)의 과거. '그 이상은 말하고 싶지 않은 듯했다'. 추측의 부드러움으로 상대의 의사를 읽음." },
      { element:"〜ずにおいた", desc:"「〜ず」(~하지 않고) + 「おく」의 과거. '~하지 않고 그대로 두었다'. 의식적으로 행동을 자제한 결과를 함축." },
    ],
    notes: [
      { title:"단락의 결말", body:"단락 12 전체가 '사모님의 출신 배경 소개 → 선생님과의 지역 무관 → 서생 시절 인연의 미궁'으로 진행되고, 마지막 478에서 화자가 스스로 캐묻기를 멈추며 닫힌다. 11단락 472에서 사모님이 답을 주지 않은 그 붉어진 얼굴이, 이번 단락 마지막에서 화자의 자제로 응답된다." },
      { title:"화자의 배려", body:"11단락에서 선생님 앞에서도 자주 '두 번째 말을 잇지 못한' 화자가(454, 467), 여기선 의식적으로 '캐묻지 않음'을 택한다. 수동적 침묵에서 능동적 자제로의 미묘한 성장." },
      { title:"사모님의 붉어진 얼굴의 지속", body:"11단락 472의 얼굴색이 한 단락을 넘어 이 문장까지 이어진다. 짧은 신체 반응이 단락의 경계를 가로질러 긴 여운으로 남는다." },
    ],
  },
];

const existingIds = new Set(novel.map(it=>it.id));
let added=0;
for (const e of newEntries) {
  if (existingIds.has(e.id)) { console.warn(`Skip ${e.id}`); continue; }
  novel.push(e); added++;
}
novel.sort((a,b)=>a.id-b.id);

const existing12 = paraMap.paragraphs.find(p=>p.paragraph===12);
if (existing12) {
  existing12.range[1] = Math.max(existing12.range[1], 478);
} else {
  paraMap.paragraphs.push({ paragraph: 12, range: [473, 478] });
  paraMap.paragraphs.sort((a,b)=>a.paragraph-b.paragraph);
}

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5","N4","N3","N2","N1"]) writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Added ${added} entries (473-${473+added-1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji`);
let vs=0; for(const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added ${vs} vocab`);
const p12 = paraMap.paragraphs.find(p=>p.paragraph===12);
console.log(`✓ Paragraph 12 range: [${p12.range[0]}, ${p12.range[1]}]`);
