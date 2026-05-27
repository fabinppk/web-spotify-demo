import { useTranslation, Trash2, X } from "@/modules";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesList() {
  const { t } = useTranslation();
  const { favorites, dispatch } = useFavorites();

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("PAGES.FAVORITES.listTitle")} ({favorites.length})
        </h2>
        {favorites.length > 0 && (
          <button
            onClick={() => dispatch({ type: "CLEAR_FAVORITES" })}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
            {t("PAGES.FAVORITES.clearAll")}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-text-muted py-4">
          {t("PAGES.FAVORITES.noFavorites")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {favorites.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 bg-surface rounded-lg px-4 py-3"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-text truncate">
                  {item.name}
                </span>
                <span className="text-xs text-text-muted capitalize">
                  {t(
                    `PAGES.FAVORITES.type${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`,
                  )}
                </span>
                {item.note && (
                  <span className="text-xs text-text-muted mt-1">
                    {item.note}
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  dispatch({
                    type: "REMOVE_FAVORITE",
                    payload: { id: item.id },
                  })
                }
                className="shrink-0 text-text-muted hover:text-red-500 transition-colors mt-0.5"
                aria-label={t("PAGES.FAVORITES.removeButton")}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
