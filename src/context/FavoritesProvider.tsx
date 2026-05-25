import { useReducer, useEffect } from "react";
import { FavoritesContext } from "./FavoritesContext";

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case "ADD_FAVORITE":
      return [...state, action.payload];
    case "REMOVE_FAVORITE":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_FAVORITES":
      return [];
    default:
      return state;
  }
}

function getInitialFavorites(): FavoritesState {
  try {
    const saved = localStorage.getItem("favorites");
    if (saved) return JSON.parse(saved) as FavoritesState;
  } catch {
    // ignore
  }
  return [];
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    getInitialFavorites,
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}
