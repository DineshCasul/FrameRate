import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  isDark: boolean;
  toggleDark: () => void;
};

const Header = ({ toggleDark }: HeaderProps) => {
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
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="relative flex my-4 sm:justify-center w-full justify-items-start sm:sticky top-0 text-black dark:text-white z-50">
      <div className="border-0 sm:border px-4 sm:px-12 items-start py-4 rounded-sm flex sm:items-center sm:size-fit max-w-4xl bg-white dark:bg-black dark:text-white relative">
        {/* Large screen nav links */}
        <div className="hidden sm:flex gap-12">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className="text-black dark:text-white transition-transform hover:scale-105"
              >
                {link.label}
              </Link>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black dark:bg-white group-hover:w-full transition-all duration-500"></span>
            </div>
          ))}
        </div>

        {/* Small screen hamburger */}
        <div className="sm:hidden">
          <button ref={buttonRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <HamburgerMenuIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Slide down menu for small screens */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="sm:hidden absolute top-full left-0 right-0 mx-4 bg-white dark:bg-black border rounded-b-sm p-4 flex flex-col gap-4 z-40"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black dark:text-white hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
      <div className="absolute sm:right-32 right-8 top-4 sm:top-4">
        <Switch onClick={toggleDark} />
      </div>
    </header>
  );
};

export default Header;
