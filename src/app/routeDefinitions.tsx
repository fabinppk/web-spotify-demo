import { lazy, Suspense } from "react";
import { type RouteObject } from "@/modules";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/ui/PageLoader";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
// const Profile = lazy(() => import("../pages/Profile"));
// const Settings = lazy(() => import("../pages/Settings"));
// const PlaylistDetail = lazy(() => import("../pages/PlaylistDetail"));
const AlbumDetail = lazy(() => import("../pages/AlbumDetail"));
const ArtistDetail = lazy(() => import("../pages/ArtistDetail"));
const Favorites = lazy(() => import("../pages/Favorites"));

export function getRoutes(): RouteObject[] {
  return [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        // {
        //   path: "playlist/:id",
        //   element: (
        //     <Suspense fallback={<PageLoader />}>
        //       <PlaylistDetail />
        //     </Suspense>
        //   ),
        // },
        {
          path: "album/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <AlbumDetail />
            </Suspense>
          ),
        },
        {
          path: "artist/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ArtistDetail />
            </Suspense>
          ),
        },
        {
          path: "favorites",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Favorites />
            </Suspense>
          ),
        },
        // {
        //   path: "profile",
        //   element: (
        //     <Suspense fallback={<PageLoader />}>
        //       <Profile />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: "settings",
        //   element: (
        //     <Suspense fallback={<PageLoader />}>
        //       <Settings />
        //     </Suspense>
        //   ),
        // },
      ],
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      ),
    },
  ];
}
