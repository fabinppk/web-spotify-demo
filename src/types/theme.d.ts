type Theme = import("@/utils/enums/enums").Theme;

type ThemeAction =
  | { type: import("@/utils/enums/enums").ThemeActionType.Toggle }
  | { type: import("@/utils/enums/enums").ThemeActionType.Set; payload: Theme };

interface ThemeContextType {
  theme: Theme;
  dispatch: React.Dispatch<ThemeAction>;
}
