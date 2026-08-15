export default function Footer() {
  return (
    <footer className="border-t border-[#e2dacd] bg-[#f4efe6] text-zinc-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/SSblacky.png"
            alt="SkillSphere Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-bold text-zinc-900 tracking-tight">
            SkillSphere
          </span>
        </div>
        <p className="text-xs text-zinc-600 text-center md:text-left">
          © {new Date().getFullYear()} SkillSphere. The premier student developer network.
        </p>
        <div className="flex items-center gap-6 text-xs text-zinc-700 font-medium">
          <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          <a href="https://github.com/skillsphere" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}