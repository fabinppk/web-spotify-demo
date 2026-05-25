import { QueryClient, QueryClientProvider, RouterProvider, Toaster } from "@/modules";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { FavoritesProvider } from "@/context/FavoritesProvider";
import { router } from "./routes";
import { getInitialTheme, queryRetry, queryStaleTime } from "@/utils";

if (!import.meta.env.VITE_CLIENT_ID) {
  throw new Error("VITE_CLIENT_ID environment variable is required");
}
if (!import.meta.env.VITE_REDIRECT_URI) {
  throw new Error("VITE_REDIRECT_URI environment variable is required");
}

// Apply saved theme immediately to avoid flash of wrong theme
const savedTheme = getInitialTheme();
document.documentElement.classList.add(savedTheme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: queryRetry,
      staleTime: queryStaleTime,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <RouterProvider router={router} />
            <Toaster position="bottom-center" richColors />
          </FavoritesProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
