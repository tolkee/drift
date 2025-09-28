import { IconFolder, IconListDetails } from "@tabler/icons-react";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    title: "Habits",
    url: "/",
    icon: IconListDetails,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: IconFolder,
  },
];
