import { useTranslation, Sun, Moon, Languages } from "@/modules";
import { useTheme } from "@/hooks";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-text-primary text-3xl font-bold mb-8">
        {t("PAGES.SETTINGS.title")}
      </h1>

      <section className="mb-8">
        <h2 className="text-text-primary text-lg font-semibold mb-4">
          {t("PAGES.SETTINGS.appearance")}
        </h2>
        <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-text-muted" />
            ) : (
              <Sun className="w-5 h-5 text-text-muted" />
            )}
            <span className="text-text-primary text-sm">
              {theme === "dark"
                ? t("PAGES.SETTINGS.darkMode")
                : t("PAGES.SETTINGS.lightMode")}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-1.5 rounded-full text-sm bg-accent text-bg font-semibold hover:opacity-90 transition-opacity"
          >
            {theme === "dark"
              ? t("PAGES.SETTINGS.switchToLight")
              : t("PAGES.SETTINGS.switchToDark")}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-text-primary text-lg font-semibold mb-4">
          {t("PAGES.SETTINGS.language")}
        </h2>
        <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-text-muted" />
            <span className="text-text-primary text-sm">
              {i18n.language === "pt" ? "Português" : "English"}
            </span>
          </div>
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt")
            }
            className="px-4 py-1.5 rounded-full text-sm bg-surface-hover text-text-primary font-semibold hover:bg-border transition-colors"
          >
            {i18n.language === "pt"
              ? "Switch to English"
              : "Mudar para Português"}
          </button>
        </div>
      </section>
    </div>
  );
}
