import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SplashLayout } from "./layouts/SplashLayout";

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
    path: "/home",
    // element : <HomeLayout />,
    children: [],
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
