export interface BuilderTitleInfo {
  title: string;
  badgeClass: string;
}

export function getBuilderTitle(projectsCount: number): BuilderTitleInfo {
  if (projectsCount < 2) {
    return {
      title: "Noob",
      badgeClass: "bg-[#f4efe6] text-zinc-800 border border-[#e2dacd]",
    };
  }
  if (projectsCount < 5) {
    return {
      title: "Beginner",
      badgeClass: "bg-blue-50 text-blue-800 border border-blue-200",
    };
  }
  if (projectsCount < 20) {
    return {
      title: "Pro",
      badgeClass: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    };
  }
  if (projectsCount < 50) {
    return {
      title: "God",
      badgeClass: "bg-purple-50 text-purple-800 border border-purple-200",
    };
  }
  return {
    title: "Grandmaster",
    badgeClass: "bg-amber-50 text-amber-900 border border-amber-300 font-extrabold",
  };
}
