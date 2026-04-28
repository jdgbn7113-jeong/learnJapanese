import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import KanjiDetailPage from "./pages/KanjiDetailPage";
import JlptListPage from "./pages/JlptListPage";
import SearchPage from "./pages/SearchPage";
import NovelListPage from "./pages/NovelListPage";
import NovelParagraphPage from "./pages/NovelParagraphPage";
import NovelReaderPage from "./pages/NovelReaderPage";
import VocabListPage from "./pages/VocabListPage";
import VocabDetailPage from "./pages/VocabDetailPage";
import RimHahahaLanding from "./components/landing/RimHahahaLanding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RimHahahaLanding />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/kanji/:char" element={<KanjiDetailPage />} />
        <Route path="/jlpt/:level" element={<JlptListPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/novel" element={<NovelListPage />} />
        <Route path="/novel/p/:pid" element={<NovelParagraphPage />} />
        <Route path="/novel/:id" element={<NovelReaderPage />} />
        <Route path="/vocab" element={<VocabListPage />} />
        <Route path="/vocab/:level" element={<VocabListPage />} />
        <Route path="/vocab/:level/:index" element={<VocabDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
