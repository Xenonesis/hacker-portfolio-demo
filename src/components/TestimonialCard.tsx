type TestimonialCardProps = { name: string; text: string };

export default function TestimonialCard({ name, text }: TestimonialCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="italic text-green-100 text-xs sm:text-sm">&quot;{text}&quot;</div>
      <div className="mt-2 text-green-300 font-bold text-xs sm:text-sm">{name}</div>
    </div>
  );
}