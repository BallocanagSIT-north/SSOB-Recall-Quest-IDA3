export default function QuizCard({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{desc}</p>
    </div>
  );
}