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

// === FIX: 455-462 back to paragraph 11 ===
let relabeled = 0;
for (const it of novel) {
  if (it.id >= 455 && it.id <= 462 && it.paragraph === 12) {
    it.paragraph = 11;
    relabeled++;
  }
}
paraMap.paragraphs = paraMap.paragraphs.filter(p => p.paragraph !== 12);

// === KANJI ===
if (!kanji["赤"]) {
  kanji["赤"] = {
    char:"赤", readings:{onyomi:["セキ","シャク"], kunyomi:["あか","あか.い"]},
    meanings:["붉다","빨강"], jlpt:"N5", grade:1, strokes:7,
    radicals:[{char:"土",meaning:"흙",position:"top"},{char:"灬",meaning:"불",position:"bottom"}],
    mnemonic:{
      radicalRoles:[{char:"土",persona:"대지"},{char:"灬",persona:"타오르는 불"}],
      story:"土(대지)와 灬(불)이 합쳐 타오르는 색 — 빨강.",
      keyImage:"불타는 대지의 색 = 빨강",
    },
    examples:[
      {word:"赤い", reading:"あかい", meaning:"빨갛다"},
      {word:"薄赤い", reading:"うすあかい", meaning:"엷게 빨갛다"},
    ],
  };
}

// === VOCAB ===
const newVocab = {
  N5: [
    { kana:"あなた", kanji:"あなた", meaning:"당신", pos:"대명사" },
  ],
  N4: [
    { kana:"ひじょうに", kanji:"非常に", meaning:"매우, 비상히", pos:"부사" },
    { kana:"じだい", kanji:"時代", meaning:"시대", pos:"명사" },
  ],
  N3: [
    { kana:"くちもと", kanji:"口元", meaning:"입가", pos:"명사" },
    { kana:"そとがわ", kanji:"外側", meaning:"바깥, 겉", pos:"명사" },
    { kana:"くちをひらく", kanji:"口を開く", meaning:"입을 열다, 말을 시작하다", pos:"관용구" },
  ],
  N2: [
    { kana:"びしょう", kanji:"微笑", meaning:"미소", pos:"명사·する동사" },
    { kana:"うすあかい", kanji:"薄赤い", meaning:"엷게 붉다", pos:"い형용사" },
  ],
  N1: [],
};
for (const [lv, words] of Object.entries(newVocab))
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

// === NEW ENTRIES 463-472, paragraph 11 ===
const newEntries = [
  {
    id: 463, paragraph: 11,
    original: "「それが解らないのよ、あなた。それが解るくらいなら私だって、こんなに心配しやしません。わからないから気の毒でたまらないんです」",
    hiragana: hira([
      ["「それが ",0],["わか",1],["らないのよ、 ",0],
      ["あなた",1],["。それが ",0],
      ["わか",1],["るくらいなら ",0],
      ["わたくし",1],["だって、こんなに ",0],
      ["しんぱい",1],["しやしません。わからないから ",0],
      ["きのどく",1],["でたまらないんです」",0],
    ]),
    meaning: "\"바로 그게 모르겠는 거예요, 당신. 그걸 알 정도라면 나도 이렇게까지 걱정하지 않아요. 모르니까 딱해서 견딜 수가 없는 거예요\"",
    vocab: mv([
      ["解る","わかる","알다"],
      ["あなた","あなた","당신"],
      ["私","わたくし","나"],
      ["心配","しんぱい","걱정"],
      ["気の毒","きのどく","딱함"],
    ]),
    grammar: [
      { element:"それが解るくらいなら〜しやしません", desc:"「くらいなら」(~할 정도라면) + 「しやしない」(=「しはしない」의 강조 부정). '그걸 알 정도라면 ~하지는 않을 것이다'. 가정 부정 — 뒤집힌 가정으로 자기 상태를 강조." },
      { element:"気の毒でたまらない", desc:"「気の毒だ」+「て」+「たまらない」. '딱해서 견딜 수 없다'. 감정의 극한을 나타내는 관용." },
    ],
    notes: [
      { title:"462의 질문에 대한 직설", body:"화자의 '그럼 왜 활동을 못 하느냐'(462)에 사모님은 해답을 주지 못한다. 대신 '나도 그걸 모른다'로 응답 — 가장 가까운 사람조차 닿지 못한다는 선생님의 내면의 불가해함이 이 한 마디에 압축." },
      { title:"「あなた」의 친밀한 호명", body:"이 때의 「あなた」는 남편을 부를 때 쓰던 메이지 부인의 일반 호칭이 아닌, 화자를 가리키는 친밀한 부름. 사모님이 화자를 남처럼이 아니라 가까운 상담자로 대하는 톤의 전환." },
    ],
  },
  {
    id: 464, paragraph: 11,
    original: "奥さんの語気には非常に同情があった。",
    hiragana: hira([
      ["おく",1],["さんの ",0],
      ["ごき",1],["には ",0],
      ["ひじょう",1],["に ",0],
      ["どうじょう",1],["があった。",0],
    ]),
    meaning: "사모님의 말투에는 깊은 동정이 배어 있었다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["語気","ごき","말투"],
      ["非常に","ひじょうに","매우"],
      ["同情","どうじょう","동정"],
    ]),
    grammar: [
      { element:"〜には〜があった", desc:"'~에는 ~이 있었다'. 한 대상의 속성이 담겨 있음을 담담히 기록하는 구문." },
    ],
    notes: [
      { title:"「語気」의 재등장", body:"11단락 422에서 선생님의 「語気」가 '불심'의 대상이었다면, 여기선 사모님의 「語気」가 '동정'의 표지. 같은 어휘가 두 인물에서 정반대 감정의 창이 된다." },
    ],
  },
  {
    id: 465, paragraph: 11,
    original: "それでも口元だけには微笑が見えた。",
    hiragana: hira([
      ["それでも ",0],
      ["くちもと",1],["だけには ",0],
      ["びしょう",1],["が ",0],
      ["み",1],["えた。",0],
    ]),
    meaning: "그래도 입가에만은 옅은 미소가 비쳤다.",
    vocab: mv([
      ["口元","くちもと","입가"],
      ["微笑","びしょう","미소"],
      ["見える","みえる","보이다"],
    ]),
    grammar: [
      { element:"〜だけには", desc:"「だけ」(~만) + 「には」(에는). '~에만'의 한정. 다른 곳이 아닌 입가라는 부위의 한정성을 강조." },
    ],
    notes: [
      { title:"감정의 이중성", body:"464의 '동정'과 465의 '미소'가 한 인물의 한 얼굴 안에 공존. 깊이 공감하면서도 웃을 수 있는 여유 — 사모님이 선생님을 오랜 세월 견뎌 온 균형이 이 한 장면에 응축." },
    ],
  },
  {
    id: 466, paragraph: 11,
    original: "外側からいえば、私の方がむしろ真面目だった。",
    hiragana: hira([
      ["そとがわ",1],["からいえば、 ",0],
      ["わたくし",1],["の ",0],
      ["ほう",1],["がむしろ ",0],
      ["まじめ",1],["だった。",0],
    ]),
    meaning: "겉으로 보자면, 오히려 내 쪽이 더 진지했다.",
    vocab: mv([
      ["外側","そとがわ","바깥, 겉"],
      ["私","わたくし","나"],
      ["方","ほう","쪽"],
      ["むしろ","むしろ","오히려"],
      ["真面目","まじめ","진지함"],
    ]),
    grammar: [
      { element:"外側からいえば", desc:"「外側から」(겉에서) + 「いえば」(~라고 하면). '겉으로 보자면'. 주관의 내부를 모른 채 외형만 본다면의 단서." },
      { element:"むしろ〜だった", desc:"「むしろ」(오히려) + 「だった」. 기대와 반대의 결과. '오히려 ~가 더 ~였다'." },
    ],
    notes: [
      { title:"외형의 역전", body:"당사자(사모님)는 미소 짓고 제3자(화자)는 굳은 얼굴. 슬픔의 주인은 웃고 동정하는 자는 찌푸린 아이러니. 감정의 무게와 표정의 방향이 어긋나는 소세키적 장면." },
    ],
  },
  {
    id: 467, paragraph: 11,
    original: "私はむずかしい顔をして黙っていた。",
    hiragana: hira([
      ["わたくし",1],["は ",0],
      ["むずか",1],["しい ",0],
      ["かお",1],["をして ",0],
      ["だま",1],["っていた。",0],
    ]),
    meaning: "나는 굳은 얼굴을 하고 입을 다물고 있었다.",
    vocab: mv([
      ["私","わたくし","나"],
      ["難しい","むずかしい","어렵다, 굳다"],
      ["顔","かお","얼굴"],
      ["黙る","だまる","입을 다물다"],
    ]),
    grammar: [
      { element:"むずかしい顔をする", desc:"관용. '어려운 얼굴을 하다' — 굳고 심각한 표정을 짓다." },
      { element:"黙っていた", desc:"「黙る」의 て형 + 「いる」의 과거. '입을 다문 상태였다'. 11단락 454의 '勇気が出なかった' 침묵과 호응." },
    ],
    notes: [
      { title:"침묵의 재현", body:"454에서 선생님 앞에 있던 화자의 '말할 용기 없음'이, 467에서 사모님 앞에서도 비슷한 굳어 있음으로 이어진다. 선생님 부부 양쪽 모두의 내면 앞에서 화자가 늘 한 발 뒤에서 묵묵히 듣는 자임을 확인하는 자세." },
    ],
  },
  {
    id: 468, paragraph: 11,
    original: "すると奥さんが急に思い出したようにまた口を開いた。",
    hiragana: hira([
      ["すると ",0],
      ["おく",1],["さんが ",0],
      ["きゅう",1],["に ",0],
      ["おも",1],["い ",0],
      ["だ",1],["したようにまた ",0],
      ["くち",1],["を ",0],
      ["ひら",1],["いた。",0],
    ]),
    meaning: "그러자 사모님은 갑자기 뭔가 떠오른 듯 다시 입을 열었다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["急に","きゅうに","갑자기"],
      ["思い出す","おもいだす","떠올리다"],
      ["口を開く","くちをひらく","입을 열다"],
    ]),
    grammar: [
      { element:"思い出したように", desc:"「思い出す」의 과거 + 「ように」. '떠올린 듯'. 외형에서 추정한 내면의 작은 전환." },
      { element:"また口を開いた", desc:"「また」(다시) + 「口を開く」의 과거. 앞서 말이 잠시 멈추었던 대화가 재개됨." },
    ],
    notes: [
      { title:"대화의 전환점", body:"선생님의 무력함에 대한 현재의 질문이 사모님의 기억을 건드려, 과거(469의 '젊은 시절')로 화제가 옮겨 간다. 단락 내 시간 축의 이동을 여는 한 문장." },
    ],
  },
  {
    id: 469, paragraph: 11,
    original: "「若い時はあんな人じゃなかったんですよ。若い時はまるで違っていました。それが全く変ってしまったんです」",
    hiragana: hira([
      ["「",0],["わか",1],["い ",0],
      ["とき",1],["はあんな ",0],
      ["ひと",1],["じゃなかったんですよ。 ",0],
      ["わか",1],["い ",0],
      ["とき",1],["はまるで ",0],
      ["ちが",1],["っていました。それが ",0],
      ["まった",1],["く ",0],
      ["か",1],["わってしまったんです」",0],
    ]),
    meaning: "\"젊을 땐 저런 사람이 아니었어요. 젊을 땐 완전히 달랐어요. 그게 아예 변해 버린 거예요\"",
    vocab: mv([
      ["若い","わかい","젊다"],
      ["時","とき","때"],
      ["人","ひと","사람"],
      ["違う","ちがう","다르다"],
      ["全く","まったく","완전히"],
      ["変る","かわる","변하다"],
    ]),
    grammar: [
      { element:"若い時は〜じゃなかった", desc:"「若い時は」(젊을 때는) + 부정. '젊을 땐 ~이 아니었다'. 대비적 과거 긍정·부정 구조." },
      { element:"全く変ってしまった", desc:"「全く」(완전히) + 「変る」의 て형 + 「しまう」의 과거. 돌이킬 수 없는 완료의 변화." },
    ],
    notes: [
      { title:"과거와 현재의 단절", body:"사모님이 세 번 반복한 「若い時」는 현재의 선생님과 대조되는 다른 사람. 정체불명의 변화 시점이 이 단락 후반의 새 화두로 떠오른다." },
      { title:"「変ってしまった」의 무력함", body:"「変った」가 아니라 「変ってしまった」. 자기 의지로 바꾼 게 아닌, 바뀌어 버린 피동. 사모님이 그 변화의 원인을 알지 못함을 동사 형태가 선행해 알린다." },
    ],
  },
  {
    id: 470, paragraph: 11,
    original: "「若い時っていつ頃ですか」と私が聞いた。「書生時代よ」",
    hiragana: hira([
      ["「",0],["わか",1],["い ",0],
      ["とき",1],["っていつ ",0],
      ["ころ",1],["ですか」と ",0],
      ["わたくし",1],["が ",0],
      ["き",1],["いた。「 ",0],
      ["しょせい",1],[" ",0],
      ["じだい",1],["よ」",0],
    ]),
    meaning: "\"젊을 때라니 언제쯤이요\"라고 나는 물었다. \"서생 시절이에요\"",
    vocab: mv([
      ["若い","わかい","젊다"],
      ["時","とき","때"],
      ["頃","ころ","무렵"],
      ["私","わたくし","나"],
      ["聞く","きく","묻다"],
      ["書生","しょせい","서생, 학생"],
      ["時代","じだい","시대"],
    ]),
    grammar: [
      { element:"〜っていつ頃ですか", desc:"「〜って」(~이라는 건) + 「いつ頃ですか」. 방금 나온 단어를 받아 되묻는 회화형." },
      { element:"書生時代よ", desc:"「書生時代」(학생 시절) + 「よ」. 단답의 친밀한 알림." },
    ],
    notes: [
      { title:"짧은 질의응답", body:"화자의 궁금증이 한 문장, 사모님의 답이 한 마디. 469의 수수께끼(변화의 시점)가 단 여섯 글자 「書生時代よ」로 좁혀진다." },
      { title:"「書生」의 시대감", body:"메이지 말의 「書生」은 대학에 적을 둔 젊은 남성 학생. 선생님의 20대, 즉 대학 시절을 가리키는 구체적 시간 좌표." },
    ],
  },
  {
    id: 471, paragraph: 11,
    original: "「書生時代から先生を知っていらっしゃったんですか」",
    hiragana: hira([
      ["「",0],["しょせい",1],[" ",0],
      ["じだい",1],["から ",0],
      ["せんせい",1],["を ",0],
      ["し",1],["っていらっしゃったんですか」",0],
    ]),
    meaning: "\"서생 시절부터 선생님을 알고 지내셨던 겁니까\"",
    vocab: mv([
      ["書生","しょせい","서생"],
      ["時代","じだい","시대"],
      ["先生","せんせい","선생님"],
      ["知る","しる","알다"],
      ["いらっしゃる","いらっしゃる","계시다, 하시다"],
    ]),
    grammar: [
      { element:"知っていらっしゃった", desc:"「知っている」(알고 있다)의 존경어 + 과거. 사모님에 대한 존경." },
      { element:"〜んですか", desc:"「〜のですか」의 회화체. 의외성과 함께 되묻는 어조." },
    ],
    notes: [
      { title:"화자의 뜻밖의 깨달음", body:"'서생 시절을 안다'는 말이 사모님이 그 시절부터 선생님을 알고 있었다는 사실의 드러냄임을 화자는 이 순간 깨닫는다. 질문의 뉘앙스에 놀라움이 실려 있음을 「〜んですか」가 받쳐 준다." },
    ],
  },
  {
    id: 472, paragraph: 11,
    original: "奥さんは急に薄赤い顔をした。",
    hiragana: hira([
      ["おく",1],["さんは ",0],
      ["きゅう",1],["に ",0],
      ["うすあか",1],["い ",0],
      ["かお",1],["をした。",0],
    ]),
    meaning: "사모님은 갑자기 얼굴이 옅게 붉어졌다.",
    vocab: mv([
      ["奥さん","おくさん","사모님"],
      ["急に","きゅうに","갑자기"],
      ["薄赤い","うすあかい","엷게 붉다"],
      ["顔","かお","얼굴"],
    ]),
    grammar: [
      { element:"薄赤い顔をした", desc:"「顔をする」 관용 — 특정 표정·안색을 짓다. 「薄赤い」가 붉어짐의 정도를 조심스레 누그러뜨린다." },
    ],
    notes: [
      { title:"답 없는 답", body:"471의 질문에 말 대신 얼굴 빛이 답한다. 자기도 모르게 드러난 옅은 홍조 — 선생님과 사모님의 관계가 학생 시절부터의 사연을 품고 있음을 말없이 확정하는 한 장면." },
      { title:"단락 11의 또 한 번의 전환", body:"단락이 '화자의 무명 선생님 걱정'(444~454)에서 '사모님의 과거 회상'(468~472)으로 축을 옮기며 닫힌다. 다음 장면은 자연스레 '그 과거는 무엇이었나'로 이어질 수 있는 여운." },
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

const p11 = paraMap.paragraphs.find(p=>p.paragraph===11);
if (p11) {
  p11.range = [Math.min(p11.range[0], 433), Math.max(p11.range[1], 472)];
}

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5","N4","N3","N2","N1"]) writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Relabeled ${relabeled} entries (455-462) from p12 → p11`);
console.log(`✓ Removed paragraph 12 from map`);
console.log(`✓ Added ${added} new entries (463-${463+added-1})`);
let vs=0; for(const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added 1 kanji, ${vs} vocab`);
console.log(`✓ Paragraph 11 range: [${p11.range[0]}, ${p11.range[1]}]`);
