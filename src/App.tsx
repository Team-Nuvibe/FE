import './App.css'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { OnboardingPage } from './Pages/OnboardingPage';
import { SplashLayout } from './layouts/SplashLayout';

// 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
    {
        path : "/",
        // errorElement : <NotFoundPage/>,
        children : [
        { index: true, element: <OnboardingPage /> },
        { path: "login", element: <LoginPage/> },
        { path: "signup", element: <SignUpPage/> },
        { path: "onboarding", element: <OnboardingPage />,},

    ]
    }
];

// 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
    {
        path : '/home',
        // element : <HomeLayout />,
        children : [

        ]
    }
];

const router = createBrowserRouter([
    {
        // 최상위에서 스플래시 레이아웃으로 감싸줍니다.
        element: <SplashLayout />, 
        children: [
            ...publicRoutes,
            ...protectedRoutes
        ]
    }
]);
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { HomeLayout } from "./layouts/HomeLayout";
import { SplashPage } from "./pages/SplashPage";
import { OnboardingPage } from "./pages/OnboardingPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <SplashPage />,
        },
        {
          path: "onboarding",
          element: <OnboardingPage />,
        },
      ],
    },
  ]);

    return (
        //  <AuthProvider>
                <RouterProvider router={router} />
        // </AuthProvider>
        
    );
    
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App


export default App;
