import { useTranslation } from "@/modules";
import { AddFavoriteForm } from "@/components/features/favorites/AddFavoriteForm";
import { FavoritesList } from "@/components/features/favorites/FavoritesList";

export default function Favorites() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-text-primary">
        {t("PAGES.FAVORITES.title")}
      </h1>
      <AddFavoriteForm />
      <FavoritesList />
    </div>
  );
}
