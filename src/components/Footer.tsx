export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/SSwhitey.png"
            alt="SkillSphere Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-bold text-white tracking-tight">
            SkillSphere
          </span>
        </div>
        <p className="text-xs text-zinc-500 text-center md:text-left">
          © {new Date().getFullYear()} SkillSphere. The premier student developer network.
        </p>
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}