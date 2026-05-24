import { useReducer, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import { Theme, ThemeActionType } from "@/utils";

function themeReducer(state: Theme, action: ThemeAction): Theme {
  switch (action.type) {
    case ThemeActionType.Toggle:
      return state === Theme.Dark ? Theme.Light : Theme.Dark;
    case ThemeActionType.Set:
      return action.payload;
    default:
      return state;
  }
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === Theme.Dark || saved === Theme.Light) return saved;
  if (typeof globalThis.matchMedia !== "function") return Theme.Dark;
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.Dark
    : Theme.Light;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, dispatch] = useReducer(
    themeReducer,
    undefined,
    getInitialTheme,
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === Theme.Dark) {
      root.classList.add(Theme.Dark);
      root.classList.remove(Theme.Light);
    } else {
      root.classList.add(Theme.Light);
      root.classList.remove(Theme.Dark);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}
