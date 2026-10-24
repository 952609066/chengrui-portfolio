import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl, siteUrl, withBasePath } from "@/lib/site.mjs";
import profile from "@/data/profile.json";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl + "/"), alternates: { canonical: absoluteUrl("/") } }
    : {}),
  title: { default: `${profile.name} | 计算机视觉与 Edge AI`, template: `%s | ${profile.name}` },
  description: profile.summary,
  robots: { index: true, follow: true },
  icons: { icon: withBasePath("/assets/monogram.svg") },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: `${profile.name} / ${profile.englishName}`,
    description: profile.title,
    ...(siteUrl ? { url: absoluteUrl("/") } : {}),
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider delayDuration={0}>
            <a className="skip-link" href="#main-content">
              跳到正文
            </a>
            <div className="personal-wrap">{children}</div>
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
