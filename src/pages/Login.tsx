import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import IconSpotify from "@/assets/svg/spotify.svg";
import { useTranslation } from "@/modules";

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-full h-screen bg-[url('/desktop-hero.png')] bg-cover bg-center absolute inset-0 z-0 opacity-20" />
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-8 z-10 relative"
        data-testid="login-page-component"
      >
        <div className="flex flex-col items-center gap-4">
          <img src={IconSpotify} alt="Ícone do spotify" className="w-16 h-16" />
          <div className="text-center">
            <h1 className="text-text-primary text-3xl font-bold">
              Olá de novo
            </h1>
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
    </div>
  );
};

export default Login;
