type ExperienceCardProps = { title: string; company: string; period: string; details: string[] };

export default function ExperienceCard({ title, company, period, details }: ExperienceCardProps) {
  return (
    <div className="mb-4 border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="font-bold text-green-200 text-sm sm:text-base">{title}</div>
      <div className="text-green-100 text-xs sm:text-sm">{company} {period}</div>
      <ul className="list-disc list-inside text-green-100 mt-2 text-xs sm:text-sm">
        {details.map((d: string, i: number) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}