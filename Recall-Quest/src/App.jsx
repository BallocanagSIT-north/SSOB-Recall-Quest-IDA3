import { useEffect, useMemo, useState } from "react";
import {
  builtInFlashcards,
  createId,
  difficulties,
  formatTime,
  getLevelInfo,
  isBetterAttempt,
  loadSavedUsers,
  makeDefaultProfile,
  menuItems,
  perfectBonusXp,
  quizTopics,
  xpPerCorrectAnswer,
} from "./studyData";
import {
  DashboardView,
  FlashcardsView,
  ProfileView,
  QuizView,
  RankingsView,
  SearchView,
  Sidebar,
  StaticView,
  TopBar,
  ViewedProfileView,
} from "./AppViews";

const loadList = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key)) || [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const hashPassword = async (username, password) => {
  const value = `${username.trim().toLowerCase()}:${password}`;

  if (window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `local-${(hash >>> 0).toString(16).padStart(8, "0")}`;
};

const cleanText = (text) => text.replace(/\s+/g, " ").trim();

const acceptedFileTypes = [
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".pdf",
  ".doc",
  ".docx",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

const splitStudyText = (text) => {
  const paragraphs = text
    .split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map(cleanText)
    .filter((item) => item.length >= 24);

  return paragraphs.slice(0, 20);
};

const makeFileStudySet = (fileId, fileName, text) => {
  const chunks = splitStudyText(text);
  const cards = chunks.map((chunk, index) => ({
    id: `${fileId}-card-${index}`,
    module: fileName,
    source: "File",
    front: `What should you remember from ${fileName} part ${index + 1}?`,
    back: chunk,
  }));

  const questions = cards.flatMap((card, index) => {
    const wrongAnswers = cards
      .filter((item) => item.id !== card.id)
      .map((item) => item.back)
      .slice(0, 3);
    const options = [card.back, ...wrongAnswers, "This was not covered in the inserted file."].slice(0, 4);

    while (options.length < 4) {
      options.push(`Review another part of ${fileName}.`);
    }

    return difficulties.map((level) => ({
      id: `${fileId}-${level}-${index}`,
      difficulty: level,
      question: `${fileName}: Which answer matches part ${index + 1}?`,
      options,
      answer: 0,
      explanation: card.back,
    }));
  });

  return {
    group: {
      id: fileId,
      title: fileName,
      desc: "Generated from an inserted file.",
      cards,
    },
    quiz: {
      title: `${fileName} Quiz`,
      desc: "Generated from an inserted file.",
      questions,
    },
  };
};

const isReadableText = (text) => {
  if (!cleanText(text)) return false;
  const sample = text.slice(0, 1000);
  const readable = sample.match(/[a-zA-Z0-9\s.,;:'"!?()[\]\-/]/g)?.length || 0;
  return readable / Math.max(sample.length, 1) > 0.75;
};

const getFileExtension = (fileName) => fileName.toLowerCase().split(".").pop() || "";

const readBlobAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const readStream = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const bytes = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.length;
  });
  return bytes;
};

const decompressBytes = async (bytes, format) => {
  if (!("DecompressionStream" in window)) {
    throw new Error("Compressed document reading is not supported in this browser.");
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
  return readStream(stream);
};

const decodeXml = (value) => {
  const element = document.createElement("textarea");
  element.innerHTML = value;
  return element.value;
};

const extractDocxText = async (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let endOfCentralDirectory = -1;

  for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      endOfCentralDirectory = offset;
      break;
    }
  }

  if (endOfCentralDirectory === -1) throw new Error("Could not read this Word document.");

  let directoryOffset = view.getUint32(endOfCentralDirectory + 16, true);
  const directoryEnd = directoryOffset + view.getUint32(endOfCentralDirectory + 12, true);
  const decoder = new TextDecoder();

  while (directoryOffset < directoryEnd && view.getUint32(directoryOffset, true) === 0x02014b50) {
    const method = view.getUint16(directoryOffset + 10, true);
    const compressedSize = view.getUint32(directoryOffset + 20, true);
    const fileNameLength = view.getUint16(directoryOffset + 28, true);
    const extraLength = view.getUint16(directoryOffset + 30, true);
    const commentLength = view.getUint16(directoryOffset + 32, true);
    const localHeaderOffset = view.getUint32(directoryOffset + 42, true);
    const fileName = decoder.decode(bytes.slice(directoryOffset + 46, directoryOffset + 46 + fileNameLength));

    if (fileName === "word/document.xml") {
      const localFileNameLength = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
      const compressedData = bytes.slice(dataStart, dataStart + compressedSize);
      const documentBytes = method === 0 ? compressedData : await decompressBytes(compressedData, "deflate-raw");
      const xml = decoder.decode(documentBytes);

      return decodeXml(
        xml
          .replace(/<w:tab\s*\/>/g, " ")
          .replace(/<w:br\s*\/>/g, "\n")
          .replace(/<\/w:p>/g, "\n")
          .replace(/<[^>]+>/g, "")
      );
    }

    directoryOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error("Could not find readable text in this Word document.");
};

const decodePdfString = (value) => value
  .replace(/\\([nrtbf()\\])/g, (_, token) => ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" }[token]))
  .replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(Number.parseInt(octal, 8)));

const extractPdfTextFromContent = (content) => {
  const strings = [];
  const literalPattern = /\((?:\\.|[^\\)])*\)/g;
  const hexPattern = /<([0-9a-fA-F\s]{4,})>/g;
  let match;

  while ((match = literalPattern.exec(content))) {
    strings.push(decodePdfString(match[0].slice(1, -1)));
  }

  while ((match = hexPattern.exec(content))) {
    const hex = match[1].replace(/\s/g, "");
    const bytes = [];
    for (let index = 0; index < hex.length - 1; index += 2) {
      bytes.push(Number.parseInt(hex.slice(index, index + 2), 16));
    }
    strings.push(new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes)));
  }

  return strings.join(" ");
};

const extractPdfText = async (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  const pdfText = new TextDecoder("latin1").decode(bytes);
  const candidates = [extractPdfTextFromContent(pdfText)];
  const streamPattern = /<<[\s\S]*?>>\s*stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  let match;

  while ((match = streamPattern.exec(pdfText))) {
    const dictionary = match[0].slice(0, match[0].indexOf("stream"));
    if (!dictionary.includes("/FlateDecode")) continue;

    const streamStart = match.index + match[0].indexOf("stream") + "stream".length;
    const lineBreakLength = pdfText.slice(streamStart, streamStart + 2) === "\r\n" ? 2 : pdfText[streamStart] === "\n" ? 1 : 0;
    const dataStart = streamStart + lineBreakLength;
    const dataEnd = match.index + match[0].lastIndexOf("endstream");
    try {
      const inflated = await decompressBytes(bytes.slice(dataStart, dataEnd), "deflate");
      candidates.push(extractPdfTextFromContent(new TextDecoder("latin1").decode(inflated)));
    } catch {
      // Some PDFs use filters or encodings the browser cannot decode without a full PDF engine.
    }
  }

  const text = candidates.map(cleanText).filter(Boolean).join(" ");
  if (!text) throw new Error("Could not find readable text in this PDF.");
  return text;
};

const extractFileText = async (file) => {
  const extension = getFileExtension(file.name);

  if (extension === "docx") {
    return extractDocxText(await file.arrayBuffer());
  }

  if (extension === "pdf" || file.type === "application/pdf") {
    return extractPdfText(await file.arrayBuffer());
  }

  const text = await file.text();
  if (isReadableText(text)) return text;

  if (extension === "doc") {
    throw new Error("Old .doc files are accepted, but this browser can only turn them into study material when the text is readable. Save it as .docx or PDF and try again.");
  }

  throw new Error("File does not contain readable text.");
};

const readFile = async (file) => {
  const id = createId("file");
  const text = await extractFileText(file);
  if (!isReadableText(text)) {
    throw new Error("File does not contain readable text.");
  }

  const dataUrl = await readBlobAsDataUrl(file);
  const studySet = makeFileStudySet(id, file.name, text);

  if (!studySet.group.cards.length) {
    throw new Error("File does not contain enough text.");
  }

  return {
    id,
    name: file.name,
    type: file.type || "Text file",
    size: file.size,
    dataUrl,
    addedAt: new Date().toLocaleString(),
    cardCount: studySet.group.cards.length,
    quizQuestionCount: studySet.quiz.questions.length,
    ...studySet,
  };
};

const getShareUrl = () => {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  if (configuredUrl) return configuredUrl;

  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
};

export default function App() {
  const storedUsers = loadSavedUsers();
  const currentUser = window.localStorage.getItem("recallQuestCurrentUser");
  const [activeView, setActiveView] = useState("Quiz");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isFinished, setIsFinished] = useState(false);
  const [resultAwarded, setResultAwarded] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [selectedFlashcardGroup, setSelectedFlashcardGroup] = useState("modules-1-5");
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [cardDraft, setCardDraft] = useState({ front: "", back: "" });
  const [cardMessage, setCardMessage] = useState("");
  const [profileSearch, setProfileSearch] = useState("");
  const [searchedProfileName, setSearchedProfileName] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authDraft, setAuthDraft] = useState({ username: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [users, setUsers] = useState(storedUsers);
  const [profile, setProfile] = useState(storedUsers[currentUser] || makeDefaultProfile());
  const [customCards, setCustomCards] = useState(loadList("recallQuestCards"));
  const [notes, setNotes] = useState(loadList("recallQuestNotes"));
  const [noteDraft, setNoteDraft] = useState("");
  const [files, setFiles] = useState(loadList("recallQuestFiles"));
  const [fileMessage, setFileMessage] = useState("");

  const currentQuestions = activeQuiz ? activeQuiz.questions.filter((q) => q.difficulty === difficulty) : [];
  const currentQuestion = currentQuestions[questionIndex];
  const fileFlashcardGroups = files.map((file) => file.group).filter(Boolean);
  const allFlashcardGroups = [...builtInFlashcards, ...fileFlashcardGroups];
  const fileQuizTopics = files.map((file) => file.quiz).filter(Boolean);
  const allQuizTopics = [...quizTopics, ...fileQuizTopics];
  const activeFlashcardSet = allFlashcardGroups.find((group) => group.id === selectedFlashcardGroup) || allFlashcardGroups[0];
  const visibleCustomCards = customCards.filter((card) => (card.groupId || "modules-1-5") === activeFlashcardSet.id);
  const savedUsers = useMemo(() => (profile.username === "Guest" ? users : { ...users, [profile.username]: profile }), [profile, users]);
  const savedProfiles = Object.values(savedUsers);
  const foundProfile = savedProfiles.find((item) => item.username.toLowerCase() === searchedProfileName.toLowerCase());
  const leaderboard = Object.values(savedProfiles.flatMap((user) => user.attempts || []).reduce((best, attempt) => {
    const key = `${attempt.username.toLowerCase()}-${attempt.quizTitle}-${attempt.difficulty}`;
    return isBetterAttempt(attempt, best[key]) ? { ...best, [key]: attempt } : best;
  }, {})).sort((a, b) => b.score / b.total - a.score / a.total || a.timeUsed - b.timeUsed).map((attempt) => ({ ...attempt, timeLabel: formatTime(attempt.timeUsed) }));
  const levelInfo = getLevelInfo(profile.xp);
  const resultXp = score * xpPerCorrectAnswer[difficulty] + (score === currentQuestions.length && currentQuestions.length ? perfectBonusXp : 0);
  const progress = currentQuestions.length ? Math.round(((questionIndex + 1) / currentQuestions.length) * 100) : 0;
  const shareUrl = getShareUrl();
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(shareUrl)}`;

  useEffect(() => window.localStorage.setItem("recallQuestCards", JSON.stringify(customCards)), [customCards]);
  useEffect(() => window.localStorage.setItem("recallQuestNotes", JSON.stringify(notes)), [notes]);
  useEffect(() => window.localStorage.setItem("recallQuestFiles", JSON.stringify(files)), [files]);
  useEffect(() => window.localStorage.setItem("recallQuestUsers", JSON.stringify(savedUsers)), [savedUsers]);
  useEffect(() => {
    if (profile.username === "Guest") return void window.localStorage.removeItem("recallQuestCurrentUser");
    window.localStorage.setItem("recallQuestCurrentUser", profile.username);
  }, [profile]);
  useEffect(() => {
    if (!activeQuiz || isFinished || timeLeft <= 0) return;
    const timer = window.setInterval(() => setTimeLeft((value) => (value <= 1 ? (setIsFinished(true), 0) : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [activeQuiz, isFinished, timeLeft]);
  useEffect(() => {
    if (!activeQuiz || !isFinished || resultAwarded || !currentQuestions.length) return;
    const perfect = score === currentQuestions.length;
    const attempt = { id: createId("attempt"), username: profile.username, quizTitle: activeQuiz.title, difficulty, score, total: currentQuestions.length, timeUsed: timerMinutes * 60 - timeLeft, earnedXp: resultXp, completedAt: new Date().toLocaleString() };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile((current) => ({ ...current, xp: current.xp + resultXp, achievements: perfect && !current.achievements.includes(`${activeQuiz.title} ${difficulty} Perfect`) ? [...current.achievements, `${activeQuiz.title} ${difficulty} Perfect`] : current.achievements, attempts: [attempt, ...current.attempts] }));
    setResultAwarded(true);
  }, [activeQuiz, currentQuestions.length, difficulty, isFinished, profile.username, resultAwarded, resultXp, score, timeLeft, timerMinutes]);

  const resetQuiz = () => { setQuestionIndex(0); setSelectedAnswer(null); setScore(0); setTimeLeft(timerMinutes * 60); setIsFinished(false); setResultAwarded(false); };
  const openView = (view) => { setActiveView(view); setActiveQuiz(null); setViewedProfile(null); resetQuiz(); };
  const submitAuth = async (event) => {
    event.preventDefault();
    const username = authDraft.username.trim();
    const password = authDraft.password;
    if (!username || !password) return setAuthMessage("Enter a username and password.");
    if (password.length < 4) return setAuthMessage("Use at least 4 characters for the password.");

    const latestUsers = { ...users, ...loadSavedUsers() };
    const existingUser = latestUsers[username];
    const passwordHash = await hashPassword(username, password);

    if (authMode === "register") {
      if (existingUser?.passwordHash) return setAuthMessage("That username already has a password. Log in instead.");
      const nextProfile = { ...(existingUser || makeDefaultProfile(username)), username, passwordHash };
      setUsers({ ...latestUsers, [username]: nextProfile });
      setProfile(nextProfile);
      setAuthDraft({ username: "", password: "" });
      setAuthMessage("Registration complete.");
      setAuthMode("login");
      setActiveView("Profile");
      return;
    }

    if (!existingUser?.passwordHash) {
      setAuthMode("register");
      setAuthMessage("No account found. Create one here and you will be logged in right away.");
      return;
    }
    if (existingUser.passwordHash !== passwordHash) return setAuthMessage("Password does not match.");
    setUsers(latestUsers);
    setProfile(existingUser);
    setAuthDraft({ username: "", password: "" });
    setAuthMessage("");
    setActiveView("Profile");
  };
  const addCard = (event) => { event.preventDefault(); if (!cardDraft.front.trim() || !cardDraft.back.trim()) return setCardMessage("Add both the front and back of the flashcard."); setCustomCards((cards) => [{ id: createId("custom"), groupId: activeFlashcardSet.id, module: activeFlashcardSet.title, front: cardDraft.front.trim(), back: cardDraft.back.trim(), source: "Custom" }, ...cards]); setCardDraft({ front: "", back: "" }); setCardMessage(`Added your card to ${activeFlashcardSet.title}.`); };
  const addNote = (event) => { event.preventDefault(); if (!noteDraft.trim()) return; setNotes((current) => [{ id: createId("note"), text: noteDraft.trim(), createdAt: new Date().toLocaleString() }, ...current]); setNoteDraft(""); };
  const addFiles = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    const results = await Promise.allSettled(selectedFiles.map(readFile));
    const nextFiles = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
    const failedFiles = results.filter((result) => result.status === "rejected");

    if (nextFiles.length) {
      setFiles((current) => [...nextFiles, ...current]);
      setSelectedFlashcardGroup(nextFiles[0].id);
    }

    if (failedFiles.length && nextFiles.length) {
      setFileMessage(`${nextFiles.length} file${nextFiles.length === 1 ? "" : "s"} turned into flashcards and quizzes. ${failedFiles.length} file${failedFiles.length === 1 ? "" : "s"} could not be read.`);
    } else if (nextFiles.length) {
      setFileMessage(`${nextFiles.length} file${nextFiles.length === 1 ? "" : "s"} turned into flashcards and quizzes.`);
    } else {
      setFileMessage(failedFiles[0]?.reason?.message || "Could not turn that file into study material. Use a readable document, Word, PDF, or text file.");
    }
    event.target.value = "";
  };
  const deleteFile = (id) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setCustomCards((cards) => cards.filter((card) => card.groupId !== id));
    if (selectedFlashcardGroup === id) setSelectedFlashcardGroup("modules-1-5");
    if (activeQuiz?.title === files.find((file) => file.id === id)?.quiz?.title) {
      setActiveQuiz(null);
      resetQuiz();
    }
  };
  const copyShareUrl = async () => {
    try {
      await window.navigator.clipboard.writeText(shareUrl);
      setIsShareOpen(true);
    } catch {
      setIsShareOpen(true);
    }
  };
  const viewMap = {
    Dashboard: <DashboardView notes={notes} noteDraft={noteDraft} onNoteDraftChange={setNoteDraft} onAddNote={addNote} onDeleteNote={(id) => setNotes((current) => current.filter((note) => note.id !== id))} files={files} fileMessage={fileMessage} acceptedFileTypes={acceptedFileTypes} onFilesSelected={addFiles} onDeleteFile={deleteFile} />,
    Flashcards: <FlashcardsView groups={allFlashcardGroups} selectedGroupId={selectedFlashcardGroup} cards={[...visibleCustomCards, ...activeFlashcardSet.cards]} cardDraft={cardDraft} cardMessage={cardMessage} onGroupChange={(id) => { setSelectedFlashcardGroup(id); setFlippedCardId(null); }} onDraftChange={(field, value) => { setCardDraft((draft) => ({ ...draft, [field]: value })); setCardMessage(""); }} onAddCard={addCard} flippedCardId={flippedCardId} onFlip={setFlippedCardId} onDeleteCard={(id) => setCustomCards((cards) => cards.filter((card) => card.id !== id))} />,
    Profile: <ProfileView profile={profile} levelInfo={levelInfo} attempts={profile.attempts.map((attempt) => ({ ...attempt, timeLabel: formatTime(attempt.timeUsed) }))} />,
    ViewedProfile: <ViewedProfileView profile={viewedProfile} onBack={() => setActiveView("Search")} levelInfo={viewedProfile ? getLevelInfo(viewedProfile.xp) : levelInfo} />,
    Rankings: <RankingsView quizTopics={allQuizTopics} difficulties={difficulties} leaderboard={leaderboard} />,
    Search: <SearchView searchValue={profileSearch} searchedName={searchedProfileName} foundProfile={foundProfile} onSearchChange={setProfileSearch} onSearch={(event) => { event.preventDefault(); setSearchedProfileName(profileSearch.trim()); }} onOpenProfile={(target) => { setViewedProfile(target); setActiveView("ViewedProfile"); }} levelInfo={foundProfile ? getLevelInfo(foundProfile.xp) : levelInfo} />,
    About: <StaticView label="About" title="About RecallQuest" body="This app uses original practice material inspired by Introduction to Networks topics. Login, XP, achievements, rankings, profile search, and flashcards are saved locally in this browser." />,
    Quiz: <QuizView mode={activeQuiz ? (isFinished ? "result" : "active") : "list"} activeQuiz={activeQuiz} difficulty={difficulty} difficulties={difficulties} timerMinutes={timerMinutes} currentQuestion={currentQuestion} currentQuestions={currentQuestions} questionIndex={questionIndex} score={score} progress={progress} timeLeftLabel={formatTime(timeLeft)} resultXp={resultXp} quizTopics={allQuizTopics} selectedAnswer={selectedAnswer} onClose={() => { setActiveQuiz(null); resetQuiz(); }} onRestart={resetQuiz} onSelectDifficulty={(level) => { setDifficulty(level); resetQuiz(); }} onTimerChange={(minutes) => { setTimerMinutes(minutes); if (!activeQuiz || selectedAnswer === null) setTimeLeft(minutes * 60); }} onChooseAnswer={(index) => { if (selectedAnswer !== null || isFinished) return; setSelectedAnswer(index); if (index === currentQuestion.answer) setScore((value) => value + 1); }} onNext={() => (questionIndex === currentQuestions.length - 1 ? setIsFinished(true) : (setQuestionIndex((value) => value + 1), setSelectedAnswer(null)))} onStartQuiz={(quiz) => { setActiveQuiz(quiz); resetQuiz(); }} />,
  };

  return (
    <div className={isLightTheme ? "app theme-light" : "app theme-dark"}>
      <Sidebar menuItems={menuItems} activeView={activeView} onViewChange={openView} profile={profile} levelInfo={levelInfo} themeLabel={`Theme: ${isLightTheme ? "Light" : "Dark"}`} onThemeToggle={() => setIsLightTheme((value) => !value)} />
      <main className="main-content">
        <TopBar authMode={authMode} authDraft={authDraft} authMessage={authMessage} shareUrl={shareUrl} qrImageUrl={qrImageUrl} isShareOpen={isShareOpen} onAuthModeChange={(mode) => { setAuthMode(mode); setAuthMessage(""); }} onAuthDraftChange={(field, value) => setAuthDraft((draft) => ({ ...draft, [field]: value }))} onAuthSubmit={submitAuth} onShareToggle={() => setIsShareOpen((value) => !value)} onCopyShareUrl={copyShareUrl} onLogout={() => { setProfile(makeDefaultProfile()); setAuthMode("login"); setAuthDraft({ username: "", password: "" }); setAuthMessage("Logged out. You can log in again anytime."); window.localStorage.removeItem("recallQuestCurrentUser"); setActiveView("Quiz"); }} />
        {viewMap[activeView] || viewMap.Quiz}
      </main>
    </div>
  );
}
