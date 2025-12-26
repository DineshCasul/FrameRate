import { Switch } from "@/components/ui/switch";
import Link from "next/link";

type HeaderProps = {
  isDark: boolean;
  toggleDark: () => void;
};

const Header = ({ toggleDark }: HeaderProps) => {
  return (
    <header className="flex my-4 justify-center w-full sticky top-0 text-black dark:text-white z-50">
      <div className="border px-12 py-4 rounded-sm flex items-center gap-12 bg-white dark:bg-black dark:text-white">
        <div className="flex gap-12 ">
          {[
            { href: "/", label: "Home" },
            { href: "/reviews", label: "Reviews" },
            { href: "/recommend", label: "Recommend Me" },
            { href: "/admin", label: "Admin" },
          ].map((link) => (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className="text-black dark:text-white transition-transform hover:scale-105"
              >
                {link.label}
              </Link>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black dark:bg-white group-hover:w-full dark:bg-white transition-all duration-500"></span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-32 top-4">
        <Switch onClick={toggleDark}></Switch>
      </div>
    </header>
  );
};

export default Header;
