import { withBasePath, siteUrl } from "@/lib/site.mjs";
import profile from "./profile.json";
import { HomeIcon, BriefcaseBusiness, FileText, Mail, NotebookIcon } from "lucide-react";
export const DATA = {
  ...profile,
  url: siteUrl,
  initials: "CY",
  avatarUrl: withBasePath("/assets/monogram.svg"),
  description: profile.title,
  navbar: [
    { href: withBasePath("/"), icon: HomeIcon, label: "首页" },
    { href: withBasePath("/#projects"), icon: BriefcaseBusiness, label: "项目" },
    { href: withBasePath("/blog/"), icon: NotebookIcon, label: "工程复盘" },
    { href: withBasePath("/resume.html"), icon: FileText, label: "简历" },
  ],
  contact: {
    email: profile.email,
    tel: "",
    social: { email: { name: "邮箱", url: "mailto:" + profile.email, icon: Mail, navbar: true } },
  },
  work: profile.experience.map((e) => ({
    company: e.company,
    href: withBasePath("/#work"),
    badges: [],
    location: e.place,
    title: e.role,
    logoUrl: withBasePath("/assets/monogram.svg"),
    start: e.dates.split(" — ")[0],
    end: e.dates.split(" — ")[1],
    description: e.description + " " + e.bullets.join(" "),
  })),
  skills: profile.skills.map((name) => ({ name, icon: null })),
  projects: profile.projects.map((p) => ({
    title: p.title,
    href: withBasePath("/#" + p.id),
    dates: p.dates,
    active: true,
    description: p.description,
    technologies: p.stack,
    image: withBasePath("/assets/" + p.image),
    video: "",
    links: [],
  })),
};
