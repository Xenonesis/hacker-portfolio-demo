type SkillBarProps = { name: string; percent: number };

export default function SkillBar({ name, percent }: SkillBarProps) {
  return (
    <div className="text-xs sm:text-sm">
      <div className="flex justify-between mb-1">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-[#222] rounded h-3 border border-[#39ff14]">
        <div className="bg-[#39ff14] h-3 rounded" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}