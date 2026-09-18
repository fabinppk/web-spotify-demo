import {
  useNavigate,
  useLocation,
  useTranslation,
  House,
  Search,
  Library,
  User,
} from "@/modules";
import { useContentStore } from "@/stores/useContentStore";
import { MainContent } from "@/utils";

export function MobileTabBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { currentContent, setCurrentContent } = useContentStore();

  const isHome =
    pathname === "/" &&
    currentContent !== MainContent.BROWSE &&
    currentContent !== MainContent.PLAYLISTS;
  const isSearch = pathname === "/" && currentContent === MainContent.BROWSE;
  const isLibrary =
    pathname === "/" && currentContent === MainContent.PLAYLISTS;
  const isProfile = pathname === "/profile";

  const tabs = [
    {
      icon: House,
      label: t("COMPONENTS.MOBILE_TAB_BAR.home"),
      active: isHome,
      action: () => {
        setCurrentContent(MainContent.PLAYER);
        navigate("/");
      },
    },
    {
      icon: Search,
      label: t("COMPONENTS.MOBILE_TAB_BAR.search"),
      active: isSearch,
      action: () => {
        setCurrentContent(MainContent.BROWSE);
        navigate("/");
      },
    },
    {
      icon: Library,
      label: t("COMPONENTS.MOBILE_TAB_BAR.library"),
      active: isLibrary,
      action: () => {
        setCurrentContent(MainContent.PLAYLISTS);
        navigate("/");
      },
    },
    {
      icon: User,
      label: t("COMPONENTS.MOBILE_TAB_BAR.profile"),
      active: isProfile,
      action: () => navigate("/profile"),
    },
  ];

  return (
    <nav className="md:hidden flex items-center justify-around h-14 bg-surface border-t border-border shrink-0">
      {tabs.map(({ icon: Icon, label, active, action }) => (
        <button
          key={label}
          onClick={action}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
            active ? "text-accent" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px]">{label}</span>
        </button>
      ))}
    </nav>
  );
}
