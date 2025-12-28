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
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
