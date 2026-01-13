import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { SplashLayout } from "./layouts/SplashLayout";
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

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    // errorElement : <NotFoundPage/>,
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
    ],
  },
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
          {index: true , element: <ArchivePage/> },
          {path: "/archive-board/vibetone", element: <VibetonePage /> },
          {path: "/archive-board/vibecalendar", element: <VibeCalandarPage /> },
          // {path: "/archive-board/blur", element: </> },
          {path: "/archive-board/:boardid", element: <ArchiveDetailPage /> },
        ],
      },
      {
        path: "tribe-chat",
        children: [
          // {index: true , element: <TribechatPage /> },
          // {path: "/tribe-chat:tagid", element: </> },
          // {path: "/tribe-chat:tagid/album", element: </> },
        ],
      },
      {
        path: "quickdrop",
        element: <QuickdropPage />,
      },
      {
        path: "profile",
        children: [
          // {index: true, element: <ProfilePage /> },
        ],
      },
      {
        path: "notification",
        children: [
          { index: true, element: <NotificationPage /> },
        ],
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

const router = createBrowserRouter([
  {
    // 최상위에서 스플래시 레이아웃으로 감싸줍니다.
    element: <SplashLayout />,
    children: [...publicRoutes, ...protectedRoutes],
  },
]);

function App() {
  return (
    //  <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default App;
