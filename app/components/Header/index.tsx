import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  toggleDark: () => void;
  isDark: boolean;
};

const Header = ({ toggleDark, isDark }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <header className="relative w-full sm:sticky top-0 z-50 sm:my-4 flex sm:justify-center text-foreground">
      <div className="w-full sm:w-auto sm:max-w-4xl flex items-center justify-between gap-6 px-4 sm:px-12 py-4 border-b sm:border sm:rounded-sm bg-background relative">
        {/* Large screen nav links */}
        <div className="hidden sm:flex gap-12">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className="text-foreground transition-transform hover:scale-105"
              >
                {link.label}
              </Link>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-foreground group-hover:w-full transition-all duration-500"></span>
            </div>
          ))}
        </div>

        {/* Small screen hamburger */}
        <div className="sm:hidden">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="-m-2 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
          >
            {isMenuOpen ? (
              <Cross2Icon className="w-6 h-6" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        <Switch checked={isDark} onCheckedChange={toggleDark} aria-label="Toggle dark mode" />
      </div>

      {/* Slide down menu for small screens */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="sm:hidden absolute top-full left-0 right-0 mx-4 bg-background border rounded-b-sm p-4 flex flex-col gap-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
