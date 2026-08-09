"use client";

import { Switch } from "@/components/ui/switch";

type FooterProps = {
  toggleDark: () => void;
  isDark: boolean;
};

const Footer = ({ toggleDark, isDark }: FooterProps) => {
  return (
    <footer className="w-full border-t mt-12 py-6 px-4 sm:px-12 flex items-center justify-between text-sm text-muted-foreground animate-in fade-in duration-700 fill-mode-both">
      <span>&copy; {new Date().getFullYear()} FrameRate</span>
      <div className="hidden sm:flex items-center gap-2">
        <span>Dark mode</span>
        <Switch checked={isDark} onCheckedChange={toggleDark} aria-label="Toggle dark mode" />
      </div>
    </footer>
  );
};

export default Footer;
