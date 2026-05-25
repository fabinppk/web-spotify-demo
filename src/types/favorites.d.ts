interface FavoriteItem {
  id: string;
  type: "artist" | "album" | "track";
  name: string;
  imageUrl?: string;
  note?: string;
}

type FavoritesState = FavoriteItem[];

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: { id: string } }
  | { type: "CLEAR_FAVORITES" };

interface FavoritesContextType {
  favorites: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
}
