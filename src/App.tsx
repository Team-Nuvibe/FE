import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import LoginPage from "./pages/onboarding/LoginPage";
import SignUpPage from "./pages/onboarding/SignUpPage";
import ArchivePage from "./pages/archive-board/ArchivePage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import { QuickdropPage } from "./pages/quickdrop/QuickdropPage";
import { TagDetailPage } from "./pages/tag/TagDetailPage";
import ArchiveDetailPage from "./pages/archive-board/ArchiveDetailPage";
import VibetonePage from "./pages/archive-board/VibetonePage";
import NotificationPage from "./pages/notification/NotificationPage";
import { VibeCalandarPage } from "./pages/archive-board/VibeCalendarPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";
import ProfileSettingPage from "./pages/profile/ProfileSettingPage";
import RevealImagePage from "./pages/archive-board/RevealImagePage";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TribechatPage from "./pages/tribe-chat/TribechatPage";
import TribechatRoomPage from "./pages/tribe-chat/TribechatRoomPage";
import { SplashLayout } from "./layouts/SplashLayout";
import { ScrapPage } from "./pages/tribe-chat/ScrapPage";
import ResetPasswordPage from "./pages/onboarding/ResetPasswordPage";
import OAuthCallbackPage from "./pages/oauth/OAuthCallbackPage";
import SocialSignUpCompletePage from "./pages/oauth/SocialSignUpCompletePage";
import VConsole from "vconsole";

if (import.meta.env.DEV) {
  new VConsole();
}

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    // errorElement : <NotFoundPage/>,
    element: <SplashLayout />,
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
  { path: "oauth/callback", element: <OAuthCallbackPage /> },
  { path: "oauth/signup-complete", element: <SocialSignUpCompletePage /> },
];

// 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "archive-board",
        children: [
          { index: true, element: <ArchivePage /> },
          { path: "/archive-board/vibetone", element: <VibetonePage /> },
          {
            path: "/archive-board/vibecalendar",
            element: <VibeCalandarPage />,
          },
          { path: "/archive-board/reveal", element: <RevealImagePage /> },
          { path: "/archive-board/:boardid", element: <ArchiveDetailPage /> },
        ],
      },
      {
        path: "tribe-chat",
        children: [
          { index: true, element: <TribechatPage /> },
          { path: "/tribe-chat/:tribeId", element: <TribechatRoomPage /> },
          // {path: "/tribe-chat:tagid/album", element: </> },
          { path: "/tribe-chat/scrap", element: <ScrapPage /> },
        ],
      },
      {
        path: "quickdrop",
        element: <QuickdropPage />,
      },
      {
        path: "profile",
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "edit/:type", element: <ProfileEditPage /> },
          { path: "setting/:type", element: <ProfileSettingPage /> },
          { path: "info/:type", element: <ProfileSettingPage /> },
        ],
      },
      {
        path: "notification",
        children: [{ index: true, element: <NotificationPage /> }],
      },
      {
        path: "tag",
        children: [
          // {index: true, element: <TagPage /> },
          { path: "/tag/:tagid", element: <TagDetailPage /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient = new QueryClient();

import { useFcmToken } from "./hooks/useFcmToken";

function App() {
  useFcmToken();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
