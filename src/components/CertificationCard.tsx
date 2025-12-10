type CertificationCardProps = { title: string };

export default function CertificationCard({ title }: CertificationCardProps) {
  return (
    <div className="border border-[#39ff14] rounded p-3 sm:p-4 bg-black/80 hover:bg-[#111] hover:border-cyan-400 transition text-green-200 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
      {title}
    </div>
  );
}