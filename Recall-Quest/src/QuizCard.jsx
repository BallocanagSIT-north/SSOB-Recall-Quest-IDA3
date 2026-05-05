export default function QuizCard({ title, desc, onClick }) {
  return (
    <button type="button" onClick={onClick} className="quiz-card">
      <h3 className="quiz-card-title">{title}</h3>
      <p className="quiz-card-copy">{desc}</p>
    </button>
  );
}
