import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "..", "novel", "files");
const outPath = join(__dirname, "..", "public", "data", "novel.json");
const vocabDir = join(__dirname, "..", "public", "data");
const overlayPath = join(__dirname, "..", "novel", "content-overlay.json");
const overlay = existsSync(overlayPath)
  ? JSON.parse(readFileSync(overlayPath, "utf8"))
  : {};

const paragraphMapPath = join(__dirname, "..", "novel", "paragraph-map.json");
const paragraphMap = existsSync(paragraphMapPath)
  ? JSON.parse(readFileSync(paragraphMapPath, "utf8"))
  : { paragraphs: [] };

function paragraphOf(id) {
  for (const { paragraph, range } of paragraphMap.paragraphs || []) {
    if (id >= range[0] && id <= range[1]) return paragraph;
  }
  return 0;
}

// vocab-{level}.json 파일들을 읽어 {kanji|reading -> {level, index}} 맵 구성
function buildVocabIndex() {
  const levels = ["N5", "N4", "N3", "N2", "N1"];
  const index = new Map();
  for (const level of levels) {
    const p = join(vocabDir, `vocab-${level.toLowerCase()}.json`);
    if (!existsSync(p)) continue;
    const data = JSON.parse(readFileSync(p, "utf8"));
    data.words.forEach((w, i) => {
      const kanji = w.kanji ?? w.kana;
      const reading = w.kana;
      const key = `${kanji}|${reading}`;
      if (!index.has(key)) index.set(key, { level, index: i });
    });
  }
  return index;
}

const vocabIndex = buildVocabIndex();

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, "")).trim();

// <strong>발음</strong>이 섞인 텍스트를 토큰 배열로 변환
function parseHiragana(html) {
  const normalized = html.replace(/\s+/g, " ").trim();
  const tokens = [];
  const re = /<strong>([\s\S]*?)<\/strong>|([^<]+)/g;
  let m;
  while ((m = re.exec(normalized)) !== null) {
    if (m[1] !== undefined) {
      tokens.push({ t: decodeEntities(m[1]), e: true });
    } else if (m[2] !== undefined) {
      const text = decodeEntities(m[2]);
      if (text.length > 0) tokens.push({ t: text, e: false });
    }
  }
  return tokens;
}

// 테이블 파싱: 첫 <tr>은 헤더, 나머지는 데이터
function parseTable(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
    [...r[1].matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/g)].map((c) => stripTags(c[1])),
  );
  return rows;
}

function parseNotes(html) {
  const notes = [];
  const re = /<div class="note">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1];
    const strongMatch = inner.match(/<strong>([\s\S]*?)<\/strong>([\s\S]*)/);
    if (strongMatch) {
      notes.push({
        title: stripTags(strongMatch[1]).replace(/[::]\s*$/, ""),
        body: stripTags(strongMatch[2]),
      });
    } else {
      notes.push({ title: "", body: stripTags(inner) });
    }
  }
  return notes;
}

function sectionAfter(html, heading) {
  const idx = html.indexOf(heading);
  if (idx === -1) return "";
  const next = html.slice(idx).search(/<h2>|<\/body>/);
  return next === -1 ? html.slice(idx) : html.slice(idx, idx + next);
}

function parseFile(file) {
  const html = readFileSync(join(srcDir, file), "utf8");
  const id = Number(file.match(/(\d+)/)[1]);

  const original = stripTags(
    (html.match(/<div class="original">([\s\S]*?)<\/div>/) || [, ""])[1],
  );

  const hiraganaSection = sectionAfter(html, "히라가나 변환");
  const hiraganaHtml = (hiraganaSection.match(/<p>([\s\S]*?)<\/p>/) || [, ""])[1];
  const hiragana = parseHiragana(hiraganaHtml);

  const meaningSection = sectionAfter(html, "전체 의미");
  const meaning = stripTags(
    (meaningSection.match(/<p>([\s\S]*?)<\/p>/) || [, ""])[1],
  );

  const vocabSection = sectionAfter(html, "한자 단어의 의미와 발음");
  const vocabTable = (vocabSection.match(/<table>([\s\S]*?)<\/table>/) || [, ""])[1];
  const vocabRows = parseTable(vocabTable);
  const vocab = vocabRows.slice(1).map(([kanji, reading, meaning]) => {
    const entry = { kanji, reading, meaning };
    const ref = vocabIndex.get(`${kanji}|${reading}`);
    if (ref) entry.ref = ref;
    return entry;
  });

  const grammarSection = sectionAfter(html, "문법 분석");
  const grammarTable = (grammarSection.match(/<table>([\s\S]*?)<\/table>/) || [, ""])[1];
  const grammarRows = parseTable(grammarTable);
  const grammar = grammarRows.slice(1).map(([element, desc]) => ({
    element,
    desc,
  }));

  const notesSection = sectionAfter(html, "특이점");
  const notes = parseNotes(notesSection);

  return {
    id,
    paragraph: paragraphOf(id),
    original,
    hiragana,
    meaning,
    vocab,
    grammar,
    notes,
  };
}

const files = readdirSync(srcDir)
  .filter((f) => /^sentence_\d+\.html$/.test(f))
  .sort();

const items = files
  .map(parseFile)
  .map((item) => {
    const extra = overlay[String(item.id)];
    return extra ? { ...item, ...extra } : item;
  })
  .sort((a, b) => a.id - b.id);

writeFileSync(outPath, JSON.stringify(items, null, 2), "utf8");

const paragraphsOutPath = join(
  __dirname,
  "..",
  "public",
  "data",
  "novel-paragraphs.json",
);
writeFileSync(paragraphsOutPath, JSON.stringify(paragraphMap, null, 2), "utf8");

const matchedCount = items.reduce(
  (sum, it) => sum + it.vocab.filter((v) => v.ref).length,
  0,
);
const totalVocab = items.reduce((sum, it) => sum + it.vocab.length, 0);
console.log(`Wrote ${items.length} entries to ${outPath}`);
console.log(`Vocab refs: ${matchedCount}/${totalVocab} matched against vocab-*.json`);
