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
  const [loginName, setLoginName] = useState("");
  const [users, setUsers] = useState(storedUsers);
  const [profile, setProfile] = useState(storedUsers[currentUser] || makeDefaultProfile());
  const [customCards, setCustomCards] = useState(loadList("recallQuestCards"));
  const [notes, setNotes] = useState(loadList("recallQuestNotes"));
  const [noteDraft, setNoteDraft] = useState("");

  const currentQuestions = activeQuiz ? activeQuiz.questions.filter((q) => q.difficulty === difficulty) : [];
  const currentQuestion = currentQuestions[questionIndex];
  const activeFlashcardSet = builtInFlashcards.find((group) => group.id === selectedFlashcardGroup) || builtInFlashcards[0];
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

  useEffect(() => window.localStorage.setItem("recallQuestCards", JSON.stringify(customCards)), [customCards]);
  useEffect(() => window.localStorage.setItem("recallQuestNotes", JSON.stringify(notes)), [notes]);
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
  const login = (event) => { event.preventDefault(); const username = loginName.trim(); if (!username) return; const latestUsers = { ...users, ...loadSavedUsers() }; setUsers(latestUsers); setProfile(latestUsers[username] || makeDefaultProfile(username)); setLoginName(""); setActiveView("Profile"); };
  const addCard = (event) => { event.preventDefault(); if (!cardDraft.front.trim() || !cardDraft.back.trim()) return setCardMessage("Add both the front and back of the flashcard."); setCustomCards((cards) => [{ id: createId("custom"), groupId: activeFlashcardSet.id, module: activeFlashcardSet.title, front: cardDraft.front.trim(), back: cardDraft.back.trim(), source: "Custom" }, ...cards]); setCardDraft({ front: "", back: "" }); setCardMessage(`Added your card to ${activeFlashcardSet.title}.`); };
  const addNote = (event) => { event.preventDefault(); if (!noteDraft.trim()) return; setNotes((current) => [{ id: createId("note"), text: noteDraft.trim(), createdAt: new Date().toLocaleString() }, ...current]); setNoteDraft(""); };
  const viewMap = {
    Dashboard: <DashboardView notes={notes} noteDraft={noteDraft} onNoteDraftChange={setNoteDraft} onAddNote={addNote} onDeleteNote={(id) => setNotes((current) => current.filter((note) => note.id !== id))} />,
    Flashcards: <FlashcardsView groups={builtInFlashcards} selectedGroupId={selectedFlashcardGroup} cards={[...visibleCustomCards, ...activeFlashcardSet.cards]} cardDraft={cardDraft} cardMessage={cardMessage} onGroupChange={(id) => { setSelectedFlashcardGroup(id); setFlippedCardId(null); }} onDraftChange={(field, value) => { setCardDraft((draft) => ({ ...draft, [field]: value })); setCardMessage(""); }} onAddCard={addCard} flippedCardId={flippedCardId} onFlip={setFlippedCardId} onDeleteCard={(id) => setCustomCards((cards) => cards.filter((card) => card.id !== id))} />,
    Profile: <ProfileView profile={profile} levelInfo={levelInfo} attempts={profile.attempts.map((attempt) => ({ ...attempt, timeLabel: formatTime(attempt.timeUsed) }))} />,
    ViewedProfile: <ViewedProfileView profile={viewedProfile} onBack={() => setActiveView("Search")} levelInfo={viewedProfile ? getLevelInfo(viewedProfile.xp) : levelInfo} />,
    Rankings: <RankingsView quizTopics={quizTopics} difficulties={difficulties} leaderboard={leaderboard} />,
    Search: <SearchView searchValue={profileSearch} searchedName={searchedProfileName} foundProfile={foundProfile} onSearchChange={setProfileSearch} onSearch={(event) => { event.preventDefault(); setSearchedProfileName(profileSearch.trim()); }} onOpenProfile={(target) => { setViewedProfile(target); setActiveView("ViewedProfile"); }} levelInfo={foundProfile ? getLevelInfo(foundProfile.xp) : levelInfo} />,
    About: <StaticView label="About" title="About RecallQuest" body="This app uses original practice material inspired by Introduction to Networks topics. Login, XP, achievements, rankings, profile search, and flashcards are saved locally in this browser." />,
    Quiz: <QuizView mode={activeQuiz ? (isFinished ? "result" : "active") : "list"} activeQuiz={activeQuiz} difficulty={difficulty} difficulties={difficulties} timerMinutes={timerMinutes} currentQuestion={currentQuestion} currentQuestions={currentQuestions} questionIndex={questionIndex} score={score} progress={progress} timeLeftLabel={formatTime(timeLeft)} resultXp={resultXp} quizTopics={quizTopics} selectedAnswer={selectedAnswer} onClose={() => { setActiveQuiz(null); resetQuiz(); }} onRestart={resetQuiz} onSelectDifficulty={(level) => { setDifficulty(level); resetQuiz(); }} onTimerChange={(minutes) => { setTimerMinutes(minutes); if (!activeQuiz || selectedAnswer === null) setTimeLeft(minutes * 60); }} onChooseAnswer={(index) => { if (selectedAnswer !== null || isFinished) return; setSelectedAnswer(index); if (index === currentQuestion.answer) setScore((value) => value + 1); }} onNext={() => (questionIndex === currentQuestions.length - 1 ? setIsFinished(true) : (setQuestionIndex((value) => value + 1), setSelectedAnswer(null)))} onStartQuiz={(quiz) => { setActiveQuiz(quiz); resetQuiz(); }} />,
  };

  return (
    <div className={isLightTheme ? "app theme-light" : "app theme-dark"}>
      <Sidebar menuItems={menuItems} activeView={activeView} onViewChange={openView} profile={profile} levelInfo={levelInfo} themeLabel={`Theme: ${isLightTheme ? "Light" : "Dark"}`} onThemeToggle={() => setIsLightTheme((value) => !value)} />
      <main className="main-content">
        <TopBar loginName={loginName} onLoginNameChange={setLoginName} onLogin={login} onLogout={() => { setProfile(makeDefaultProfile()); window.localStorage.removeItem("recallQuestCurrentUser"); setActiveView("Quiz"); }} />
        {viewMap[activeView] || viewMap.Quiz}
      </main>
    </div>
  );
}
