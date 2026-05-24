import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import IconSpotify from "@/assets/svg/spotify.svg";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen bg-bg flex flex-col items-center justify-center gap-8"
      data-testid="login-page-component"
    >
      <div className="flex flex-col items-center gap-4">
        <img src={IconSpotify} alt="Ícone do spotify" className="w-16 h-16" />
        <div className="text-center">
          <h1 className="text-text-primary text-3xl font-bold">Spotify</h1>
          <p className="text-text-muted text-sm mt-1">
            {t("PAGES.LOGIN.tagline")}
          </p>
        </div>
      </div>
      <Button
        onClick={login}
        data-testid="login-button"
        className="bg-accent hover:bg-accent-muted text-bg font-semibold rounded-full text-lg py-6 px-12"
      >
        {t("PAGES.LOGIN.loginButton")}
      </Button>
    </div>
  );
};

export default Login;
