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
  "求": nk("求",["キュウ"],["もと.める"],["구하다","요구"],"N3",4,7,
    [["一","선","top"],["冫","방울","middle"],["水","물","bottom"]],
    "손을 뻗어 물·도움을 구하는 모양을 본뜬 형 — 구하다, 요구.",
    "뻗은 손으로 구하다",
    [{word:"求める",reading:"もとめる",meaning:"구하다, 요구하다"}]),
  "罪": nk("罪",["ザイ"],["つみ"],["죄","잘못"],"N3",5,13,
    [["罒","그물","top"],["非","아님","bottom"]],
    "罒(그물) 아래 非(아님) — 법의 그물에 걸린 '옳지 않음' = 죄.",
    "그물에 걸린 옳지 않음 = 죄",
    [{word:"罪悪",reading:"ざいあく",meaning:"죄악"}]),
};
for (const [ch,e] of Object.entries(newKanji)) if(!kanji[ch]) kanji[ch]=e;

const newVocab = {
  N5: [],
  N4: [
    { kana:"あたたかい", kanji:"暖かい", meaning:"따뜻하다", pos:"い형용사" },
  ],
  N3: [
    { kana:"もとめる", kanji:"求める", meaning:"구하다, 요구하다", pos:"동사" },
    { kana:"あじわう", kanji:"味わう", meaning:"맛보다, 음미하다", pos:"동사" },
    { kana:"まじる", kanji:"交る", meaning:"섞이다", pos:"동사" },
  ],
  N2: [
    { kana:"ざいあく", kanji:"罪悪", meaning:"죄악", pos:"명사" },
  ],
  N1: [
    { kana:"ひやかし", kanji:"冷評", meaning:"냉소, 놀림 (冷やかし 표기)", pos:"명사·する동사" },
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
    id: 504, paragraph: 12,
    original: "「君は恋をした事がありますか」私はないと答えた。",
    hiragana: hira([
      ["「",0],["きみ",1],["は ",0],
      ["こい",1],["をした ",0],
      ["こと",1],["がありますか」 ",0],
      ["わたくし",1],["はないと ",0],
      ["こた",1],["えた。",0],
    ]),
    meaning: "\"자네는 사랑을 해 본 적이 있습니까\" 나는 없다고 대답했다.",
    vocab: mv([
      ["君","きみ","자네"],
      ["恋","こい","사랑"],
      ["事","こと","일"],
      ["私","わたくし","나"],
      ["答える","こたえる","대답하다"],
    ]),
    grammar: [
      { element:"〜した事がありますか", desc:"「〜した事がある」(~한 적이 있다)의 의문. 경험을 묻는 표준 구문. 정중체로 격식을 지킨 선생님 화법." },
      { element:"私はないと答えた", desc:"「ない」(없다) + 「と答える」의 과거. '없다고 대답했다'. 짧고 건조한 대답으로 화자의 거리감 표시." },
    ],
    notes: [
      { title:"503이 예고한 질문의 개시", body:"503 「それから私にこう聞いた」의 「こう」가 가리키던 질문이 이 504에서 드러난다. 선생님이 우에노의 연인 장면을 매개로 화자에게 사적 영역을 묻기 시작하는 결정적 첫 질문." },
      { title:"대사와 짧은 답변의 결합", body:"501의 대사 + 대사 결합과 같은 방식. 여기서는 선생님의 질문과 화자의 단답을 한 엔트리로 묶어 질의응답의 리듬을 한 호흡으로 담는다." },
    ],
  },
  {
    id: 505, paragraph: 12,
    original: "「恋をしたくはありませんか」私は答えなかった。",
    hiragana: hira([
      ["「",0],["こい",1],["をしたくはありませんか」 ",0],
      ["わたくし",1],["は ",0],
      ["こた",1],["えなかった。",0],
    ]),
    meaning: "\"사랑을 하고 싶지는 않습니까\" 나는 대답하지 않았다.",
    vocab: mv([
      ["恋","こい","사랑"],
      ["私","わたくし","나"],
      ["答える","こたえる","대답하다"],
    ]),
    grammar: [
      { element:"〜したくはありませんか", desc:"「〜したい」(희망) + 「は」(주제화) + 「ありませんか」(부정 의문). '~하고 싶지는 않습니까'. 의사·감정의 핵심을 찌르는 반문." },
      { element:"答えなかった", desc:"「答える」의 부정 과거. 답의 내용이 아닌 침묵 자체를 서술." },
    ],
    notes: [
      { title:"단답에서 침묵으로", body:"504의 '없다'는 짧은 사실 답에서, 505의 무응답으로 수위가 한 단계 깊어진다. '한 적이 없다'는 경험의 부재는 답할 수 있지만, '하고 싶지 않은가'의 욕망 질문엔 침묵으로 응한다." },
    ],
  },
  {
    id: 506, paragraph: 12,
    original: "「したくない事はないでしょう」「ええ」",
    hiragana: hira([
      ["「したくない ",0],
      ["こと",1],["はないでしょう」「ええ」",0],
    ]),
    meaning: "\"하고 싶지 않은 건 아니겠지요\" \"예\"",
    vocab: mv([
      ["事","こと","일"],
    ]),
    grammar: [
      { element:"したくない事はないでしょう", desc:"「したくない事はない」(하고 싶지 않은 것은 없다) + 「でしょう」(~이겠지요)의 이중 부정 추측. '어느 정도는 하고 싶겠지요'." },
      { element:"ええ", desc:"가벼운 긍정의 간투사. 망설임을 담은 맞장구." },
    ],
    notes: [
      { title:"세 짧은 교환의 결합", body:"선생님 유도 + 화자의 수동적 시인. 「ええ」는 한 음절 수준의 응답. 세 개의 짧은 응답을 한 엔트리로 결합해 질의 압박과 위축된 긍정의 리듬을 전달." },
      { title:"이중 부정의 압박", body:"「したくない事はない」 — 두 번 뒤집힌 부정이 결과적으로 '하고 싶다'로 귀결. 선생님이 화자의 내면을 논리로 몰아붙여 시인을 얻어내는 방식." },
    ],
  },
  {
    id: 507, paragraph: 12,
    original: "「君は今あの男と女を見て、冷評しましたね。あの冷評のうちには君が恋を求めながら相手を得られないという不快の声が交っていましょう」",
    hiragana: hira([
      ["「",0],["きみ",1],["は ",0],
      ["いま",1],["あの ",0],
      ["おとこ",1],["と ",0],
      ["おんな",1],["を ",0],
      ["み",1],["て、 ",0],
      ["ひやかし",1],["ましたね。あの ",0],
      ["ひやかし",1],["のうちには ",0],
      ["きみ",1],["が ",0],
      ["こい",1],["を ",0],
      ["もと",1],["めながら ",0],
      ["あいて",1],["を ",0],
      ["え",1],["られないという ",0],
      ["ふかい",1],["の ",0],
      ["こえ",1],["が ",0],
      ["まじ",1],["っていましょう」",0],
    ]),
    meaning: "\"자네는 지금 저 남녀를 보고 냉소를 던졌지요. 그 냉소 안에는 자네가 사랑을 원하면서도 상대를 얻지 못한다는 불쾌의 소리가 섞여 있을 겁니다\"",
    vocab: mv([
      ["君","きみ","자네"],
      ["今","いま","지금"],
      ["男","おとこ","남자"],
      ["女","おんな","여자"],
      ["見る","みる","보다"],
      ["冷評","ひやかし","냉소"],
      ["恋","こい","사랑"],
      ["求める","もとめる","구하다"],
      ["相手","あいて","상대"],
      ["得る","える","얻다"],
      ["不快","ふかい","불쾌"],
      ["声","こえ","소리"],
      ["交る","まじる","섞이다"],
    ]),
    grammar: [
      { element:"冷評(ひやかし)しましたね", desc:"여기의 「冷評」는 「ひやかし」로 훈독. 「冷やかし」와 같은 뜻 — '놀림, 냉소'. 11단락 448의 「冷評(れいひょう)」과 다른 음 — 같은 한자의 이중 용법." },
      { element:"〜ながら〜得られない", desc:"「〜ながら」(~하면서) + 「得られない」(얻지 못하다). 욕망과 획득 부재의 대립을 한 줄에 압축." },
      { element:"〜という〜の声が交っていましょう", desc:"「〜という〜声」(~라는 소리) + 「交る」의 て형 + 「いましょう」(있을 것이다). 직접 증명 없이 상대의 무의식을 추정하는 격식 있는 통찰." },
    ],
    notes: [
      { title:"선생님의 꿰뚫기", body:"화자의 평범한 맞장구('사이가 좋아 보이네요')를 선생님은 '냉소'로 재해석하고, 그 속에서 '사랑을 원하지만 얻지 못한 자의 불쾌'를 읽어낸다. 504~506의 압박이 여기에 이르러 목적을 드러낸다." },
      { title:"「冷評」의 재사용", body:"11단락 448에서 화자가 선생님의 겸손을 '冷評(れいひょう)에 가깝게' 읽었던 그 어휘가, 507에서 선생님이 화자의 맞장구를 '冷評(ひやかし)'로 읽는 형태로 뒤집힌다. 두 사람이 서로의 발화를 같은 한자로 재해석하는 공명." },
    ],
  },
  {
    id: 508, paragraph: 12,
    original: "「そんな風に聞こえましたか」",
    hiragana: hira([
      ["「そんな ",0],
      ["ふう",1],["に ",0],
      ["き",1],["こえましたか」",0],
    ]),
    meaning: "\"그런 식으로 들리셨습니까\"",
    vocab: mv([
      ["聞こえる","きこえる","들리다"],
    ]),
    grammar: [
      { element:"そんな風に", desc:"「そんな風」(그런 식) + 「に」. '그런 식으로'. 상대의 해석에 대한 거리두기의 첫 반응." },
      { element:"聞こえましたか", desc:"「聞こえる」의 정중체 과거 의문. 주체를 명시하지 않고 '들렸는가'만 묻는 수동적 구문." },
    ],
    notes: [
      { title:"화자의 방어적 반문", body:"선생님의 날카로운 해석(507)에 화자는 부정도 수긍도 하지 않고 '그렇게 들렸는가'를 되묻는다. 자기 내면을 직접 인정하지 않으면서도 부인하지도 않는 중간 지대." },
    ],
  },
  {
    id: 509, paragraph: 12,
    original: "「聞こえました。恋の満足を味わっている人はもっと暖かい声を出すものです。しかし……しかし君、恋は罪悪ですよ。解っていますか」",
    hiragana: hira([
      ["「",0],["き",1],["こえました。 ",0],
      ["こい",1],["の ",0],
      ["まんぞく",1],["を ",0],
      ["あじ",1],["わっている ",0],
      ["ひと",1],["はもっと ",0],
      ["あたた",1],["かい ",0],
      ["こえ",1],["を ",0],
      ["だ",1],["すものです。しかし……しかし ",0],
      ["きみ",1],["、 ",0],
      ["こい",1],["は ",0],
      ["ざいあく",1],["ですよ。 ",0],
      ["わ",1],["かっていますか」",0],
    ]),
    meaning: "\"들렸습니다. 사랑의 만족을 맛보고 있는 사람은 더 따뜻한 목소리를 내기 마련이에요. 그러나… 그러나 자네, 사랑은 죄악입니다. 아시겠습니까\"",
    vocab: mv([
      ["聞こえる","きこえる","들리다"],
      ["恋","こい","사랑"],
      ["満足","まんぞく","만족"],
      ["味わう","あじわう","맛보다"],
      ["人","ひと","사람"],
      ["暖かい","あたたかい","따뜻하다"],
      ["声","こえ","소리"],
      ["出す","だす","내다"],
      ["君","きみ","자네"],
      ["罪悪","ざいあく","죄악"],
      ["解る","わかる","알다"],
    ]),
    grammar: [
      { element:"〜ものです", desc:"일반 진리·성질을 서술하는 종결. '~하기 마련이다'. 선생님의 단정적 어조." },
      { element:"しかし……しかし", desc:"역접의 반복 + 말줄임표. 한 번 꺼낸 역접을 끊었다가 다시 잡아 이어 가는 머뭇거림 — 다음 말의 무게를 예고." },
      { element:"恋は罪悪ですよ", desc:"「罪悪」(죄악) + 「ですよ」. 단언 + 상대에게의 알림. 본 장면 전체의 핵심 발화." },
    ],
    notes: [
      { title:"소설의 핵심 선언", body:"「恋は罪悪ですよ」. 이 일곱 글자가 『こころ』 전체의 주제를 관통한다. 선생님이 자기 내면의 과거를 빌려 화자에게 건네는 경고." },
      { title:"두 번의 「しかし」와 말줄임표", body:"「しかし……しかし」의 반복과 점선이 발화의 고통을 시각화. 단정 뒤에 숨은 선생님 자신의 과거 상처가 새어 나오는 틈." },
      { title:"「暖かい声」의 되울림", body:"11단락 411 「妻君のために」가 화자의 마음을 '따뜻하게(暖か)' 만든 그 「暖か」가, 여기서 '사랑의 만족을 맛본 사람의 목소리' 기준으로 다시 등장. 따뜻함의 부재가 화자에게도 선생님에게도 공통의 결핍으로 묶인다." },
    ],
  },
  {
    id: 510, paragraph: 12,
    original: "私は急に驚かされた。何とも返事をしなかった。",
    hiragana: hira([
      ["わたくし",1],["は ",0],
      ["きゅう",1],["に ",0],
      ["おどろ",1],["かされた。 ",0],
      ["なん",1],["とも ",0],
      ["へんじ",1],["をしなかった。",0],
    ]),
    meaning: "나는 갑자기 놀라게 되었다. 아무런 대답도 하지 않았다.",
    vocab: mv([
      ["私","わたくし","나"],
      ["急に","きゅうに","갑자기"],
      ["驚く","おどろく","놀라다"],
      ["何とも","なんとも","아무런"],
      ["返事","へんじ","대답"],
    ]),
    grammar: [
      { element:"驚かされた", desc:"「驚く」의 사역 수동 + 과거. '놀라게 되었다'. 자기 의지가 아니라 상대의 말에 의해 놀라움이 주어진 구조를 문법으로 드러냄." },
      { element:"何とも返事をしなかった", desc:"「何とも」(아무런) + 「返事をする」의 부정 과거. '아무 대답도 하지 않았다'. 11단락 391 「何の答えもし得なかった」와 같은 결의 무응답." },
    ],
    notes: [
      { title:"반복되는 침묵", body:"선생님의 강한 말 앞에서 화자의 무응답이 또다시 등장. 11단락 454 「二の句の継げないほどに強い」와 12단락 510이 같은 구조 — 선생님의 결정적 발화에 이어지는 화자의 침묵이 단락의 리듬." },
      { title:"두 짧은 문장의 결합", body:"502와 같은 방식으로 '반응(놀람) + 행동 결여(무응답)' 두 짧은 사실을 한 엔트리로 묶었다. 장면의 마무리가 한 호흡으로 완성되도록." },
      { title:"단락의 임시 정지", body:"『こころ』의 중심 명제 「恋は罪悪」가 공중에 떠 있는 채로 화자의 침묵으로 장면이 닫힌다. 이 말의 의미는 단락 12 안에서는 풀리지 않고 뒤에서 계속 울리게 된다." },
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

const p12 = paraMap.paragraphs.find(p=>p.paragraph===12);
if (p12) p12.range[1] = Math.max(p12.range[1], 510);

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5","N4","N3","N2","N1"]) writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Added ${added} entries (504-${504+added-1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji`);
let vs=0; for(const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added ${vs} vocab`);
console.log(`✓ Paragraph 12 range: [${p12.range[0]}, ${p12.range[1]}]`);
