import { createContext } from "react";

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);
