import QuizCard from "./QuizCard";

const join = (...names) => names.filter(Boolean).join(" ");

const Panel = ({ children, className = "" }) => (
  <section className={join("panel", className)}>{children}</section>
);

const Metric = ({ label, value, accent, children }) => (
  <div className="metric-card">
    <p className="metric-label">{label}</p>
    <p className={join("metric-value", accent && "metric-value-accent")}>{value}</p>
    {children}
  </div>
);

export function Sidebar({ menuItems, activeView, onViewChange, profile, levelInfo, themeLabel, onThemeToggle }) {
  return (
    <aside className="sidebar">
      <div>
        <button type="button" onClick={() => onViewChange("Profile")} className="account-card">
          <p className="eyebrow">Account</p>
          <p className="account-name">{profile.username}</p>
          <div className="account-row">
            <span>Level {levelInfo.level}</span>
            <span className="text-accent">{profile.xp} XP</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${levelInfo.progress}%` }} />
          </div>
          <p className="account-meta">
            {levelInfo.level >= 50 ? "Max level reached" : `${levelInfo.xpNeeded - levelInfo.xpIntoLevel} XP to next level`}
          </p>
          <p className="account-meta">{profile.achievements.length} achievements</p>
        </button>
        <h1 className="brand">RecallQuest</h1>
        <nav className="nav-list">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onViewChange(item)}
              className={join("nav-button", activeView === item && "nav-button-active")}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <button type="button" onClick={onThemeToggle} className="theme-button">{themeLabel}</button>
    </aside>
  );
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function TopBar(props) {
  const {
    authMode,
    authDraft,
    authMessage,
    shareUrl,
    qrImageUrl,
    isShareOpen,
    onAuthModeChange,
    onAuthDraftChange,
    onAuthSubmit,
    onShareToggle,
    onCopyShareUrl,
    onLogout,
  } = props;
  return (
    <div className="topbar">
      <div className="share-wrap">
        <button type="button" onClick={onShareToggle} className="button button-secondary">
          QR Share
        </button>
        {isShareOpen && (
          <div className="share-popover">
            <p className="eyebrow">Share app</p>
            <img src={qrImageUrl} alt="QR code to open RecallQuest" className="qr-image" />
            <input value={shareUrl} readOnly className="field-input share-link" />
            <button type="button" onClick={onCopyShareUrl} className="button button-primary">
              Copy link
            </button>
          </div>
        )}
      </div>
      <form onSubmit={onAuthSubmit} className="login-form">
        <div className="auth-tabs" aria-label="Account action">
          <button type="button" onClick={() => onAuthModeChange("login")} className={join("auth-tab", authMode === "login" && "auth-tab-active")}>
            Login
          </button>
          <button type="button" onClick={() => onAuthModeChange("register")} className={join("auth-tab", authMode === "register" && "auth-tab-active")}>
            Register
          </button>
        </div>
        <input
          value={authDraft.username}
          onChange={(event) => onAuthDraftChange("username", event.target.value)}
          placeholder="Username"
          className="field-input field-input-inline"
        />
        <input
          value={authDraft.password}
          onChange={(event) => onAuthDraftChange("password", event.target.value)}
          placeholder="Password"
          type="password"
          className="field-input field-input-inline"
        />
        <button type="submit" className="button button-primary">
          {authMode === "login" ? "Log in" : "Register"}
        </button>
        <button type="button" onClick={onLogout} className="button button-secondary">
          Log out
        </button>
        {authMessage && <p className="auth-message">{authMessage}</p>}
      </form>
    </div>
  );
}

export function DashboardView({ notes, noteDraft, onNoteDraftChange, onAddNote, onDeleteNote, files, fileMessage, onFilesSelected, onDeleteFile }) {
  return (
    <div className="stack">
      <Panel>
        <p className="eyebrow">Dashboard</p>
        <h2 className="page-title">Study Notes</h2>
        <p className="page-copy">Create quick notes for topics, reminders, or things you want to review later.</p>
        <form onSubmit={onAddNote} className="form-stack">
          <textarea
            value={noteDraft}
            onChange={(event) => onNoteDraftChange(event.target.value)}
            placeholder="Write a note..."
            rows="4"
            className="field-input field-textarea"
          />
          <button type="submit" className="button button-primary button-fit">
            Add note
          </button>
        </form>
      </Panel>
      <Panel>
        <div className="section-head">
          <h3 className="section-title">Your Notes</h3>
          <p className="muted">{notes.length} saved</p>
        </div>
        <div className="notes-grid">
          {notes.length === 0 ? (
            <p className="muted">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <article key={note.id} className="note-card">
                <p className="note-text">{note.text}</p>
                <div className="note-footer">
                  <span className="muted subtle">{note.createdAt}</span>
                  <button type="button" onClick={() => onDeleteNote(note.id)} className="button button-secondary button-small">
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>
      <Panel>
        <div className="section-head">
          <div>
            <p className="eyebrow">Files</p>
            <h3 className="section-title">Inserted Files</h3>
          </div>
          <label className="button button-primary button-fit file-picker">
            Insert files
            <input type="file" multiple onChange={onFilesSelected} />
          </label>
        </div>
        {fileMessage && <p className="text-accent">{fileMessage}</p>}
        <div className="file-list">
          {files.length === 0 ? (
            <p className="muted">No files inserted yet.</p>
          ) : (
            files.map((file) => (
              <article key={file.id} className="file-item">
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="muted subtle">{file.type} - {formatFileSize(file.size)} - {file.addedAt}</p>
                  <p className="muted subtle">{file.cardCount} flashcards - {file.quizQuestionCount} quiz questions</p>
                </div>
                <div className="button-row">
                  <a href={file.dataUrl} download={file.name} className="button button-secondary button-small">Download</a>
                  <button type="button" onClick={() => onDeleteFile(file.id)} className="button button-secondary button-small">
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

export function FlashcardsView(props) {
  const {
    groups,
    selectedGroupId,
    cards,
    cardDraft,
    cardMessage,
    onGroupChange,
    onDraftChange,
    onAddCard,
    flippedCardId,
    onFlip,
    onDeleteCard,
  } = props;
  const group = groups.find((item) => item.id === selectedGroupId) || groups[0];
  return (
    <div>
      <Panel className="panel-spaced">
        <p className="eyebrow">Flashcards</p>
        <h2 className="section-title-large">Built-in, file, and custom cards</h2>
        <p className="page-copy">Choose a module group or inserted file, click a card to flip it, or create your own card for that group.</p>
        <div className="chip-row">
          {groups.map((item) => (
            <button key={item.id} type="button" onClick={() => onGroupChange(item.id)} className={join("chip", item.id === selectedGroupId && "chip-active")}>
              {item.title}
            </button>
          ))}
        </div>
        <p className="muted">Showing {cards.length} cards for {group.title}.</p>
        <form onSubmit={onAddCard} className="flashcard-form">
          <input value={cardDraft.front} onChange={(event) => onDraftChange("front", event.target.value)} placeholder="Front: term or question" className="field-input" />
          <input value={cardDraft.back} onChange={(event) => onDraftChange("back", event.target.value)} placeholder="Back: answer or explanation" className="field-input" />
          <button type="submit" className="button button-primary">Add card</button>
        </form>
        {cardMessage && <p className="text-accent">{cardMessage}</p>}
      </Panel>
      <div className="card-grid">
        {cards.map((card) => {
          const flipped = flippedCardId === card.id;
          return (
            <article key={card.id} className="flashcard">
              <button type="button" onClick={() => onFlip(flipped ? null : card.id)} className="flashcard-button">
                <div className="flashcard-head">
                  <span className="tag">{card.module}</span>
                  <span className="muted subtle">{card.source}</span>
                </div>
                <p className="flashcard-text">{flipped ? card.back : card.front}</p>
                <p className="muted">{flipped ? "Click to see the front" : "Click to see the answer"}</p>
              </button>
              {card.source === "Custom" && (
                <button type="button" onClick={() => onDeleteCard(card.id)} className="button button-secondary button-small">
                  Delete
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

const badgeList = (achievements, emptyText) => (
  <div className="info-grid">
    {achievements.length === 0 ? <p className="muted">{emptyText}</p> : achievements.map((item) => <div key={item} className="badge-card"><p className="eyebrow">Badge</p><p>{item}</p></div>)}
  </div>
);

export function ProfileView({ profile, levelInfo, attempts }) {
  return (
    <div className="stack">
      <Panel>
        <p className="eyebrow">Profile</p>
        <h2 className="page-title">{profile.username}</h2>
        <div className="metric-grid">
          <Metric label="Level" value={levelInfo.level} accent><div className="progress-track"><div className="progress-fill" style={{ width: `${levelInfo.progress}%` }} /></div><p className="muted">{levelInfo.level >= 50 ? "Max level reached" : `${levelInfo.xpIntoLevel} / ${levelInfo.xpNeeded} XP`}</p></Metric>
          <Metric label="Total XP" value={profile.xp} />
          <Metric label="Achievements" value={profile.achievements.length} />
        </div>
      </Panel>
      <Panel><h3 className="section-title">Perfect Quiz Badges</h3>{badgeList(profile.achievements, "Perfect a quiz to unlock your first badge.")}</Panel>
      <Panel>
        <h3 className="section-title">Recent Quiz Attempts</h3>
        <div className="attempt-list">
          {attempts.length === 0 ? <p className="muted">Complete a quiz to start building your history.</p> : attempts.slice(0, 6).map((attempt) => <div key={attempt.id} className="attempt-item"><div><p>{attempt.quizTitle}</p><p className="muted">{attempt.difficulty} - {attempt.score}/{attempt.total} - {attempt.timeLabel}</p></div><p className="text-accent">+{attempt.earnedXp} XP</p></div>)}
        </div>
      </Panel>
    </div>
  );
}

export function ViewedProfileView({ profile, onBack, levelInfo }) {
  if (!profile) return <Panel><h2 className="section-title-large">Profile not selected</h2><button type="button" onClick={onBack} className="button button-primary button-fit">Back to search</button></Panel>;
  return (
    <div className="stack">
      <Panel>
        <button type="button" onClick={onBack} className="button button-secondary button-fit">Back to search</button>
        <p className="eyebrow top-gap">Profile</p>
        <h2 className="page-title">{profile.username}</h2>
        <div className="metric-grid">
          <Metric label="Level" value={levelInfo.level} accent />
          <Metric label="Total XP" value={profile.xp} />
          <Metric label="Achievements" value={profile.achievements.length} />
        </div>
      </Panel>
      <Panel><h3 className="section-title">Achievements</h3>{badgeList(profile.achievements, "This profile has no badges yet.")}</Panel>
    </div>
  );
}

export function RankingsView({ quizTopics, difficulties, leaderboard }) {
  return (
    <Panel>
      <p className="eyebrow">Rankings</p>
      <h2 className="page-title">Quiz and Time Rankings</h2>
      <p className="page-copy">Rankings sort by highest score first, then fastest time for that quiz and difficulty.</p>
      <div className="stack">
        {quizTopics.map((quiz) => (
          <article key={quiz.title} className="subpanel">
            <h3 className="section-title">{quiz.title}</h3>
            <div className="ranking-grid">
              {difficulties.map((level) => {
                const rows = leaderboard.filter((entry) => entry.quizTitle === quiz.title && entry.difficulty === level).slice(0, 5);
                return (
                  <div key={level} className="ranking-card">
                    <p className="text-accent">{level}</p>
                    <div className="attempt-list">
                      {rows.length === 0 ? <p className="muted">No attempts yet.</p> : rows.map((entry, index) => <div key={`${entry.username}-${index}`} className="ranking-row"><span>{index + 1}. {entry.username}</span><span className="muted">{entry.score}/{entry.total} - {entry.timeLabel}</span></div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function SearchView({ searchValue, searchedName, foundProfile, onSearchChange, onSearch, onOpenProfile, levelInfo }) {
  return (
    <Panel>
      <p className="eyebrow">Search</p>
      <h2 className="page-title">Find a Profile</h2>
      <p className="page-copy">Search a username to view that profile and achievements. No profiles are shown until you search.</p>
      <form onSubmit={onSearch} className="search-form">
        <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search username" className="field-input" />
        <button type="submit" className="button button-primary">Search</button>
      </form>
      {searchedName && !foundProfile && <div className="subpanel"><p>No profile found for "{searchedName}".</p><p className="muted">Try another username.</p></div>}
      {foundProfile && <button type="button" onClick={() => onOpenProfile(foundProfile)} className="search-result"><p className="eyebrow">Profile</p><h3 className="section-title">{foundProfile.username}</h3><p className="muted">Level {levelInfo.level} - {foundProfile.xp} XP</p><div className="progress-track"><div className="progress-fill" style={{ width: `${levelInfo.progress}%` }} /></div><div className="attempt-list">{foundProfile.achievements.map((achievement) => <div key={achievement} className="mini-badge">{achievement}</div>)}</div></button>}
    </Panel>
  );
}

export function QuizView(props) {
  const { mode, activeQuiz, difficulty, timerMinutes, currentQuestion, currentQuestions, questionIndex, score, progress, timeLeftLabel, resultXp, quizTopics, onClose, onRestart, onSelectDifficulty, onTimerChange, onChooseAnswer, onNext, selectedAnswer } = props;
  if (mode === "result") return <Panel><p className="eyebrow">{activeQuiz.title}</p><h2 className="page-title">Quiz complete</h2><p className="page-copy">You scored {score} out of {currentQuestions.length} on {difficulty}.</p><p className="text-accent">+{resultXp} XP {score === currentQuestions.length ? "and a perfect badge unlocked." : "added to your profile."}</p><div className="button-row"><button type="button" onClick={onRestart} className="button button-primary">Try again</button><button type="button" onClick={onClose} className="button button-secondary">Back to quizzes</button></div></Panel>;
  if (mode === "active") return <Panel><div className="quiz-head"><button type="button" onClick={onClose} className="button button-secondary button-fit">Back to quizzes</button><div className="timer-block"><p className="muted">Time left</p><p className="timer-value">{timeLeftLabel}</p></div></div><div className="quiz-meta"><div><p className="eyebrow">{activeQuiz.title}</p><h2 className="section-title-large">Question {questionIndex + 1} of {currentQuestions.length}</h2></div><p className="score-pill">Score: {score}</p></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><h3 className="quiz-question">{currentQuestion.question}</h3><div className="answer-grid">{currentQuestion.options.map((option, index) => { const correct = selectedAnswer !== null && index === currentQuestion.answer; const wrong = selectedAnswer === index && !correct; return <button key={option} type="button" onClick={() => onChooseAnswer(index)} className={join("answer-button", correct && "answer-correct", wrong && "answer-wrong")}>{option}</button>; })}</div>{selectedAnswer !== null && <div className="explanation-box"><p>{selectedAnswer === currentQuestion.answer ? "Correct!" : "Not quite."}</p><p className="muted">{currentQuestion.explanation}</p>{selectedAnswer !== currentQuestion.answer && <p className="muted">Correct answer: {currentQuestion.options[currentQuestion.answer]}</p>}<button type="button" onClick={onNext} className="button button-primary button-fit">{questionIndex === currentQuestions.length - 1 ? "Finish quiz" : "Next question"}</button></div>}</Panel>;
  return <><Panel><h2 className="section-title-large">Practice Quizzes</h2><p className="page-copy">Choose a built-in module quiz or a quiz generated from an inserted file.</p><div className="quiz-controls"><div className="chip-row">{props.difficulties.map((level) => <button key={level} type="button" onClick={() => onSelectDifficulty(level)} className={join("chip", difficulty === level && "chip-active")}>{level}</button>)}</div><label className="timer-control"><span className="muted">Timer</span><input type="range" min="1" max="30" value={timerMinutes} onChange={(event) => onTimerChange(Number(event.target.value))} className="timer-slider" /><span className="text-accent">{timerMinutes} min</span></label></div></Panel><div className="quiz-topic-grid">{quizTopics.map((quiz) => <QuizCard key={quiz.title} title={quiz.title} desc={`${quiz.desc} ${quiz.questions.filter((question) => question.difficulty === difficulty).length} ${difficulty.toLowerCase()} questions.`} onClick={() => props.onStartQuiz(quiz)} />)}</div></>;
}

export function StaticView({ title, body, label }) {
  return <Panel><p className="eyebrow">{label}</p><h2 className="page-title">{title}</h2><p className="page-copy">{body}</p></Panel>;
}
