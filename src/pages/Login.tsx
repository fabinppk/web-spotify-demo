import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import IconSpotify from "../assets/svg/spotify.svg";

const Login = () => {
  const { login } = useAuth();

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
            Enjoy your music to the fullest.
          </p>
        </div>
      </div>
      <Button
        onClick={login}
        data-testid="login-button"
        className="bg-accent hover:bg-accent-muted text-bg font-semibold rounded-full text-lg py-6 px-12"
      >
        Log in with Spotify
      </Button>
    </div>
  );
};

export default Login;
