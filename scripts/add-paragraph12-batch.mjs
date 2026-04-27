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
for (const lv of ["N5","N4","N3","N2","N1"]) {
  vocabFiles[lv] = JSON.parse(readFileSync(vocabPath(lv), "utf8"));
}

const nk = (char, on, kun, mean, jlpt, grade, strokes, rads, story, keyImage, examples) => ({
  char, readings: { onyomi: on, kunyomi: kun }, meanings: mean, jlpt, grade, strokes,
  radicals: rads.map(([c,m,p])=>({char:c,meaning:m,position:p})),
  mnemonic: { radicalRoles: rads.map(([c,m])=>({char:c,persona:m})), story, keyImage },
  examples,
});

const newKanji = {
  "健": nk("健",["ケン"],["すこ.やか"],["건강하다","굳세다"],"N3",4,11,
    [["亻","사람","left"],["建","세우다","right"]],
    "亻(사람)이 建(꼿꼿이 서) 있음 — 굳셈, 건강.",
    "꼿꼿이 선 사람 = 건강",
    [{word:"健康", reading:"けんこう", meaning:"건강"}]),
  "勉": nk("勉",["ベン"],["つと.める"],["힘쓰다"],"N4",3,10,
    [["免","면하다·벗어남","top"],["力","힘","bottom"]],
    "免(면하다) 아래 力(힘) — 고난을 벗어나려 힘씀 = 힘쓰다, 공부하다.",
    "힘껏 노력하다 = 공부",
    [{word:"勉強", reading:"べんきょう", meaning:"공부"}]),
  "康": nk("康",["コウ"],[],["편안하다","건강"],"N3",4,11,
    [["广","집 지붕","outside"],["隶","손으로 받침","inside"]],
    "广(지붕) 아래 隶(손으로 받쳐 든 모양) — 집안이 튼튼히 받쳐져 편안함 = 건강.",
    "집안이 편안함 = 건강",
    [{word:"健康", reading:"けんこう", meaning:"건강"}]),
};
for (const [ch,e] of Object.entries(newKanji)) if(!kanji[ch]) kanji[ch]=e;

const newVocab = {
  N5: [
    { kana:"じょうぶ", kanji:"丈夫", meaning:"튼튼함", pos:"な형용사" },
  ],
  N4: [
    { kana:"けんこう", kanji:"健康", meaning:"건강", pos:"명사·な형용사" },
  ],
  N3: [
    { kana:"かつどう", kanji:"活動", meaning:"활동", pos:"명사·する동사" },
  ],
  N2: [
    { kana:"さとる", kanji:"悟る", meaning:"깨닫다", pos:"동사" },
    { kana:"じびょう", kanji:"持病", meaning:"지병", pos:"명사" },
  ],
  N1: [],
};
for (const [lv,words] of Object.entries(newVocab)) {
  for (const w of words) vocabFiles[lv].words.push(w);
}

const vIdx = new Map();
for (const lv of ["N5","N4","N3","N2","N1"]) {
  vocabFiles[lv].words.forEach((w,i)=>{
    const key = `${w.kanji ?? w.kana}|${w.kana}`;
    if(!vIdx.has(key)) vIdx.set(key, { level:lv, index:i });
  });
}
function vref(k,r){ return vIdx.get(`${k}|${r}`); }
function mv(items){
  return items.map(([k,r,m])=>{
    const ref = vref(k,r);
    return ref ? {kanji:k,reading:r,meaning:m,ref} : {kanji:k,reading:r,meaning:m};
  });
}
function hira(parts){ return parts.map(([t,e])=>({t,e:!!e})); }

const newEntries = [
  {
    id: 455, paragraph: 12,
    original: "私が奥さんと話している間に、問題が自然先生の事からそこへ落ちて来た。",
    hiragana: hira([
      ["わたくし",1],["が ",0],
      ["おく",1],["さんと ",0],
      ["はな",1],["している ",0],
      ["あいだ",1],["に、 ",0],
      ["もんだい",1],["が ",0],
      ["しぜん",1],[" ",0],
      ["せんせい",1],["の ",0],
      ["こと",1],["からそこへ ",0],
      ["お",1],["ちて ",0],
      ["き",1],["た。",0],
    ]),
    meaning: "내가 사모님과 이야기를 나누는 동안, 화제가 저절로 선생님의 이야기로 옮겨 앉았다.",
    vocab: mv([
      ["私","わたくし","나"],
      ["奥さん","おくさん","사모님"],
      ["話す","はなす","이야기하다"],
      ["間","あいだ","동안"],
      ["問題","もんだい","문제, 화제"],
      ["自然","しぜん","자연스럽게, 저절로"],
      ["先生","せんせい","선생님"],
      ["事","こと","일"],
      ["落ちる","おちる","떨어지다, 이르다"],
      ["来る","くる","오다"],
    ]),
    grammar: [
      { element:"〜間に", desc:"'~동안에'. 어떤 시간 폭 안에서 일어난 일을 잡는 구문." },
      { element:"自然〜落ちて来た", desc:"「自然」(저절로) + 「落ちる」의 て형 + 「来る」의 과거. '저절로 ~로 내려앉았다'. 주체의 의도가 아니라 화제가 스스로 흘러 이른 것처럼 표현하는 소세키의 전형적 자동성 어법." },
    ],
    notes: [
      { title:"단락 11과의 연결", body:"11단락 439에서 예고된 '귀에 남은 한 가지'가 이 12단락에서 본격적으로 펼쳐진다. 화제가 자연스레 선생님의 무직 생활로 옮겨 앉는 모습으로 대화 장면이 열림." },
      { title:"「問題が落ちて来た」", body:"화제를 물건처럼 '떨어져 내려왔다'로 표현. 의도적으로 끌어낸 것이 아니라 대화의 흐름 속에서 자연히 도달했음을 무생물적 주어로 객관화." },
    ],
  },
  {
    id: 456, paragraph: 12,
    original: "「先生はなぜああやって、宅で考えたり勉強したりなさるだけで、世の中へ出て仕事をなさらないんでしょう」",
    hiragana: hira([
      ["「",0],["せんせい",1],["はなぜああやって、 ",0],
      ["うち",1],["で ",0],
      ["かんが",1],["えたり ",0],
      ["べんきょう",1],["したりなさるだけで、 ",0],
      ["よのなか",1],["へ ",0],
      ["で",1],["て ",0],
      ["しごと",1],["をなさらないんでしょう」",0],
    ]),
    meaning: "\"선생님은 왜 저렇게 집에서 생각하거나 공부만 하시고, 세상에 나가 일을 하지 않으시는 걸까요\"",
    vocab: mv([
      ["先生","せんせい","선생님"],
      ["宅","うち","집"],
      ["考える","かんがえる","생각하다"],
      ["勉強","べんきょう","공부"],
      ["世の中","よのなか","세상"],
      ["出る","でる","나가다"],
      ["仕事","しごと","일"],
    ]),
    grammar: [
      { element:"ああやって", desc:"'저렇게, 저런 식으로'. 눈앞에 대상이 있는 듯 가리키는 구어." },
      { element:"〜たり〜たりなさるだけで", desc:"「Aたり Bたり」 동작 열거 + 존경어 「なさる」 + 「だけで」(~할 뿐). '~하거나 ~하거나 하시기만 할 뿐'. 선생님 행위를 존경어로 받으면서도 제한성을 표시." },
      { element:"〜んでしょう", desc:"「〜のでしょう」의 회화체. 상대의 견해를 부드럽게 구하는 의문." },
    ],
    notes: [
      { title:"화자의 첫 질문", body:"11단락에서 선생님 본인에게 직접 물어도 답을 얻지 못한 화제를, 이번엔 사모님께 돌려 묻는다. 선생님의 부재가 열어 준 대화 공간에서 화자의 궁금증이 제3자를 통해 풀려 간다." },
      { title:"존경어의 사용", body:"화자는 선생님을 「なさる」로 높여 부른다. 상대가 사모님이라도 선생님에 대한 경의는 유지하는 화자의 일관된 말법." },
    ],
  },
  {
    id: 457, paragraph: 12,
    original: "「あの人は駄目ですよ。そういう事が嫌いなんですから」",
    hiragana: hira([
      ["「あの ",0],["ひと",1],["は ",0],
      ["だめ",1],["ですよ。そういう ",0],
      ["こと",1],["が ",0],
      ["きら",1],["いなんですから」",0],
    ]),
    meaning: "\"저 사람은 안 돼요. 그런 일을 싫어하니까요\"",
    vocab: mv([
      ["人","ひと","사람"],
      ["駄目","だめ","안 됨"],
      ["事","こと","일"],
      ["嫌い","きらい","싫음"],
    ]),
    grammar: [
      { element:"あの人は駄目ですよ", desc:"「あの人」는 '저 사람' — 가까운 사람을 친근히 가리키는 호칭. 「駄目」는 '쓸모없음'이 아니라 '그런 방면으로는 안 되는 사람'의 의미." },
      { element:"〜んですから", desc:"「〜のですから」의 회화체. 이유 설명. '~이니까요'. 친근한 어조." },
    ],
    notes: [
      { title:"사모님의 어조", body:"남편을 「あの人」로 부르고 「駄目」라 단정하는 친밀하고도 솔직한 화법. 선생님의 격식 있는 말투(「私(わたくし)」, 「妻(さい)」)와 대조되는 일상적 여성 화자의 목소리." },
      { title:"답의 단순성", body:"화자의 '왜?'에 사모님은 '싫어해서'라는 단순한 답부터 시작. 깊은 분석이 아니라 가장 가까이에서 본 관찰 — 다음 458~459에서 화자가 그 답의 의미를 더 파고든다." },
    ],
  },
  {
    id: 458, paragraph: 12,
    original: "「つまり下らない事だと悟っていらっしゃるんでしょうか」",
    hiragana: hira([
      ["「つまり ",0],["くだ",1],["らない ",0],
      ["こと",1],["だと ",0],
      ["さと",1],["っていらっしゃるんでしょうか」",0],
    ]),
    meaning: "\"말하자면 시시한 일이라고 깨달으신 걸까요\"",
    vocab: mv([
      ["下らない","くだらない","시시한"],
      ["事","こと","일"],
      ["悟る","さとる","깨닫다"],
    ]),
    grammar: [
      { element:"〜と悟っていらっしゃる", desc:"「〜と悟る」의 て형 + 「いらっしゃる」(존경). '~라고 깨달으셨다'. 선생님을 존경어로 받으며 깨달음의 내용을 추정." },
      { element:"〜でしょうか", desc:"부드러운 의문. 단정 대신 상대의 판단을 구하는 어조." },
    ],
    notes: [
      { title:"화자의 재해석", body:"사모님의 '싫어한다'를 화자는 '시시하다고 깨달은 결과'로 고쳐 묻는다. 감정(싫음)을 사상(깨달음)으로 격상하려는 시도 — 화자가 선생님을 지적 인물로 해석하려는 태도." },
    ],
  },
  {
    id: 459, paragraph: 12,
    original: "「悟るの悟らないのって、――そりゃ女だからわたくしには解りませんけれど、おそらくそんな意味じゃないでしょう。やっぱり何かやりたいのでしょう。それでいてできないんです。だから気の毒ですわ」",
    hiragana: hira([
      ["「",0],["さと",1],["るの ",0],
      ["さと",1],["らないのって、――そりゃ ",0],
      ["おんな",1],["だからわたくしには ",0],
      ["わか",1],["りませんけれど、おそらくそんな ",0],
      ["いみ",1],["じゃないでしょう。やっぱり ",0],
      ["なに",1],["かやりたいのでしょう。それでいてできないんです。だから ",0],
      ["きのどく",1],["ですわ」",0],
    ]),
    meaning: "\"깨닫고 말고 할 것도 없이 ― 뭐 저야 여자라서 잘 모릅니다만, 아마 그런 의미는 아닐 거예요. 역시 뭐든 하고 싶은 거겠지요. 그러면서도 못 하는 겁니다. 그래서 딱한 거지요\"",
    vocab: mv([
      ["悟る","さとる","깨닫다"],
      ["女","おんな","여자"],
      ["解る","わかる","알다"],
      ["意味","いみ","의미"],
      ["何","なに","무엇"],
      ["気の毒","きのどく","딱함"],
    ]),
    grammar: [
      { element:"悟るの悟らないのって", desc:"「Aの Bのって」구문. '깨닫든 말든 간에' — 대립하는 두 선택지를 한꺼번에 제쳐 놓는 가벼운 구어." },
      { element:"そりゃ女だから〜", desc:"「そりゃ」(뭐 그야) + 「女だから」. 화자 자신의 무지를 여성이라는 위치로 설명하는 메이지적 자기 격하 — 당시 여성 화법의 전형." },
      { element:"やっぱり〜のでしょう", desc:"「やっぱり」(역시) + 「のでしょう」(~이겠지요). 자기 추정을 부드럽게 내놓는 어조." },
      { element:"それでいてできない", desc:"「それでいて」(~이면서도). 앞 절과 모순되는 뒤 절을 잇는 접속. 욕망과 무력함의 병존을 한 단어로 이음." },
      { element:"気の毒ですわ", desc:"「ですわ」는 여성적 종조사. '안쓰러워요'의 부드러운 마무리." },
    ],
    notes: [
      { title:"화자 해석의 부정", body:"사모님은 화자의 '悟った' 해석을 「そんな意味じゃない」로 뒤집는다. 깨달음(사상)이 아니라 하고 싶은데 못 하는 상태(무력) — 선생님을 지적인 인물로 보려던 화자의 해석과 다른 '가까이서 본 남편'상." },
      { title:"「やりたい」+「できない」의 구조", body:"'욕망 vs 무력'이라는 짧은 구조가 선생님의 모순을 요약. 11단락 451 화자가 '반항 vs 아쉬움'으로 자기를 재명명했듯, 여기선 사모님이 선생님을 재명명한다." },
      { title:"사모님의 해답", body:"단순한 '싫어함'(457)이 '하고 싶지만 못 함'(459)으로 깊어짐. 두 문장 사이에 화자의 해석 시도(458)가 끼어들면서 답이 단계적으로 심화되는 대화의 결." },
    ],
  },
  {
    id: 460, paragraph: 12,
    original: "「しかし先生は健康からいって、別にどこも悪いところはないようじゃありませんか」",
    hiragana: hira([
      ["「しかし ",0],["せんせい",1],["は ",0],
      ["けんこう",1],["からいって、 ",0],
      ["べつ",1],["にどこも ",0],
      ["わる",1],["いところはないようじゃありませんか」",0],
    ]),
    meaning: "\"하지만 선생님은 건강 면에서 보자면, 딱히 어디도 나쁜 데가 없어 보이지 않습니까\"",
    vocab: mv([
      ["先生","せんせい","선생님"],
      ["健康","けんこう","건강"],
      ["別に","べつに","특별히"],
      ["悪い","わるい","나쁘다"],
    ]),
    grammar: [
      { element:"〜からいって", desc:"'~로 말하자면, ~에서 본다면'. 판단의 근거·관점을 먼저 제시." },
      { element:"別にどこも〜ないようじゃありませんか", desc:"「別に」(특별히) + 「どこも」(어디도) + 부정 + 「ようじゃありませんか」(~하지 않습니까). 완곡한 반문." },
    ],
    notes: [
      { title:"사유에서 신체로", body:"459가 '마음의 문제'를 말한 직후, 460은 곧장 '몸'을 묻는다. 선생님의 무력함이 마음의 문제라면 신체는 건강할 텐데 — 화자의 질문이 다음 답(461)을 예고하며 한 단계 좁혀 들어간다." },
    ],
  },
  {
    id: 461, paragraph: 12,
    original: "「丈夫ですとも。何にも持病はありません」",
    hiragana: hira([
      ["「",0],["じょうぶ",1],["ですとも。 ",0],
      ["なに",1],["にも ",0],
      ["じびょう",1],["はありません」",0],
    ]),
    meaning: "\"튼튼하고말고요. 아무 지병도 없습니다\"",
    vocab: mv([
      ["丈夫","じょうぶ","튼튼함"],
      ["何","なに","무엇"],
      ["持病","じびょう","지병"],
    ]),
    grammar: [
      { element:"〜ですとも", desc:"「とも」는 강한 긍정의 종조사. '~이고말고요'. 의심의 여지를 남기지 않는 단언." },
      { element:"何にも〜ありません", desc:"「何にも」(아무것도) + 부정. 완전 부정. 461은 건강에 관해 어떤 의심도 차단." },
    ],
    notes: [
      { title:"명쾌한 긍정", body:"화자의 완곡한 질문(460)에 사모님은 두 번 거듭 긍정 — 「丈夫ですとも」+「持病はありません」. 이 명쾌함이 다음 462의 의문 '그럼 왜?'를 필연적으로 끌어온다." },
    ],
  },
  {
    id: 462, paragraph: 12,
    original: "「それでなぜ活動ができないんでしょう」",
    hiragana: hira([
      ["「それでなぜ ",0],["かつどう",1],["ができないんでしょう」",0],
    ]),
    meaning: "\"그럼 왜 활동을 못 하는 걸까요\"",
    vocab: mv([
      ["活動","かつどう","활동"],
    ]),
    grammar: [
      { element:"それでなぜ〜", desc:"「それで」(그러면) + 「なぜ」(왜). 앞 절의 긍정(건강함)에서 곧장 반문으로 이어지는 짧은 논리." },
      { element:"〜んでしょう", desc:"부드러운 의문. 단락 456의 첫 질문과 같은 말미 — 화자의 궁금증이 대화 내내 같은 톤으로 이어진다." },
    ],
    notes: [
      { title:"단락의 열린 결말", body:"단락 12가 해답 없이 또 하나의 질문으로 닫힌다. 사상(458)도 몸(460)도 답이 아닐 때 남는 것 — '그럼 무엇이?'. 선생님의 무력함이 점점 더 좁혀진 미지의 영역으로 몰려가는 리듬. 다음 단락에서 사모님이 다른 각도의 답을 꺼낼 준비를 이 열린 질문이 만든다." },
    ],
  },
];

const existingIds = new Set(novel.map(it=>it.id));
let added = 0;
for (const e of newEntries) {
  if (existingIds.has(e.id)) { console.warn(`Skip ${e.id}`); continue; }
  novel.push(e); added++;
}
novel.sort((a,b)=>a.id-b.id);

const existing12 = paraMap.paragraphs.find(p=>p.paragraph===12);
if (existing12) {
  existing12.range[1] = Math.max(existing12.range[1], 462);
} else {
  paraMap.paragraphs.push({ paragraph: 12, range: [455, 462] });
  paraMap.paragraphs.sort((a,b)=>a.paragraph-b.paragraph);
}

writeFileSync(kanjiPath, JSON.stringify(kanji, null, 2), "utf8");
for (const lv of ["N5","N4","N3","N2","N1"]) {
  writeFileSync(vocabPath(lv), JSON.stringify(vocabFiles[lv], null, 2), "utf8");
}
writeFileSync(novelPath, JSON.stringify(novel, null, 2), "utf8");
writeFileSync(novelParaSrc, JSON.stringify(paraMap, null, 2), "utf8");
writeFileSync(novelParaPub, JSON.stringify(paraMap, null, 2), "utf8");

console.log(`✓ Added ${added} entries (455-${455+added-1})`);
console.log(`✓ Added ${Object.keys(newKanji).length} kanji`);
let vs=0; for(const lv of Object.keys(newVocab)) vs += newVocab[lv].length;
console.log(`✓ Added ${vs} vocab`);
const p12 = paraMap.paragraphs.find(p=>p.paragraph===12);
console.log(`✓ Paragraph 12 range: [${p12.range[0]}, ${p12.range[1]}]`);
