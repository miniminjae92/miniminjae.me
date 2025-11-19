import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsSunFill, BsFillMoonStarsFill } from "react-icons/bs";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "system") {
      if (resolvedTheme === "light") {
        setTheme("dark");
      } else if (resolvedTheme === "dark") {
        setTheme("light");
      }
    } else if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    }
  };

  if (!mounted) {
    return (
      <button className="p-2 rounded-full invisible">
        <BsSunFill className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? BsSunFill : BsFillMoonStarsFill;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-full text-heading hover:text-heading hover:bg-gray-100 transition"
      aria-label="Toggle theme"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
