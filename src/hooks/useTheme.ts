import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeActionType } from "@/utils";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  const toggleTheme = () => ctx.dispatch({ type: ThemeActionType.Toggle });
  return { theme: ctx.theme, toggleTheme };
}
