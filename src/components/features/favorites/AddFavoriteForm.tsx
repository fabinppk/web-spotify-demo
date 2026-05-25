import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/hooks/useFavorites";
import { favoriteSchema, FavoriteFormData } from "./schema";

export function AddFavoriteForm() {
  const { t } = useTranslation();
  const { dispatch } = useFavorites();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FavoriteFormData>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: { type: "track" },
  });

  const onSubmit = (data: FavoriteFormData) => {
    dispatch({
      type: "ADD_FAVORITE",
      payload: { ...data, id: crypto.randomUUID() },
    });
    reset({ type: "artist" });
  };

  return (
    <section className="bg-surface rounded-lg flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text-primary">
        {t("PAGES.FAVORITES.addTitle")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label={t("PAGES.FAVORITES.nameLabel")}
          error={errors.name ? t("PAGES.FAVORITES.nameRequired") : undefined}
        >
          <Input
            {...register("name")}
            placeholder={t("PAGES.FAVORITES.namePlaceholder")}
          />
        </FormField>

        <FormField label={t("PAGES.FAVORITES.typeLabel")}>
          <select
            {...register("type")}
            className="bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
          >
            <option value="artist">{t("PAGES.FAVORITES.typeArtist")}</option>
            <option value="album">{t("PAGES.FAVORITES.typeAlbum")}</option>
            <option value="track">{t("PAGES.FAVORITES.typeTrack")}</option>
          </select>
        </FormField>

        <FormField
          label={t("PAGES.FAVORITES.noteLabel")}
          error={errors.note?.message}
        >
          <textarea
            {...register("note")}
            placeholder={t("PAGES.FAVORITES.notePlaceholder")}
            rows={3}
            className="bg-bg border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent resize-none"
          />
        </FormField>

        <button
          type="submit"
          className="bg-accent hover:bg-accent-muted text-black font-semibold rounded-full px-6 py-2 text-sm transition-colors self-start"
        >
          {t("PAGES.FAVORITES.submit")}
        </button>
      </form>
    </section>
  );
}
