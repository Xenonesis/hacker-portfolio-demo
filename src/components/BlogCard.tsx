type BlogCardProps = { title: string; description: string };

export default function BlogCard({ title, description }: BlogCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{description}</div>
    </div>
  );
}