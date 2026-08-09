import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { TYPE_QUICK_LINKS } from "@/lib/utils";

type Props = {
  toggleDark: () => void;
  isDark: boolean;
};

const Header = ({ toggleDark, isDark }: Props) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/reviews", label: "Reviews" },
    { href: "/recommend", label: "Recommend Me" },
  ];

  // Same quick filters as the homepage hero — only surfaced in the mobile
  // menu, desktop nav stays as-is.
  const typeShortcuts = TYPE_QUICK_LINKS;

  return (
    <header className="relative w-full sm:sticky top-0 z-50 sm:my-4 flex sm:justify-center text-foreground">
      <div
        className={`w-full sm:w-auto sm:max-w-4xl flex items-center justify-between gap-6 px-4 sm:px-12 py-4 border-b sm:border sm:rounded-sm relative transition-[box-shadow,background-color,backdrop-filter] duration-300 animate-in fade-in slide-in-from-top-4 animation-duration-500 fill-mode-both ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-lg shadow-black/10 dark:shadow-black/40"
            : "bg-background"
        }`}
      >
        {/* Small screen logo */}
        <Link href="/" className="sm:hidden w-8 h-8 relative shrink-0">
          <Image
            src="/images/FrameRate.png"
            alt="FrameRate"
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src="/images/FrameRate-white.png"
            alt="FrameRate"
            fill
            className="object-contain hidden dark:block"
          />
        </Link>

        {/* Large screen nav links */}
        <div className="hidden sm:flex gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="text-foreground transition-transform hover:scale-105"
                >
                  {link.label}
                </Link>
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-foreground transition-all duration-500 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </div>
            );
          })}
        </div>

        {/* Small screen hamburger */}
        <div className="sm:hidden ml-auto">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="-m-2 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer flex items-center justify-center"
          >
            {isMenuOpen ? (
              <Cross2Icon className="w-6 h-6" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Slide down menu for small screens */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="sm:hidden absolute top-full left-0 right-0 mx-4 bg-background border rounded-b-sm p-4 flex flex-col gap-4 z-40 shadow-lg shadow-black/10 dark:shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`hover:scale-105 ${isActive ? "font-bold text-foreground" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="border-t pt-4 flex flex-col gap-4">
            {typeShortcuts.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-sm">Dark mode</span>
            <Switch checked={isDark} onCheckedChange={toggleDark} aria-label="Toggle dark mode" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
