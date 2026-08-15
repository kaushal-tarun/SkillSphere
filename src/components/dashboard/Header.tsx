"use client";

import React from "react";
import { NavTab } from "./Sidebar";

interface HeaderProps {
  activeNav: NavTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewProjectModal: () => void;
}

export function Header({
  activeNav,
  searchQuery,
  setSearchQuery,
  onOpenNewProjectModal,
}: HeaderProps) {
  return null;
}
