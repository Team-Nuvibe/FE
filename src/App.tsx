import './App.css'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'

// 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
    {
        path : "/",
        // element : <HomeLayout/>,
        // errorElement : <NotFoundPage/>,
        children : [
        // { index: true, element: <HomePage/> },
        { path: "login", element: <LoginPage/> },
        { path: "signup", element: <SignUpPage/> },

    ]
    }
];

// 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [{}];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
function App() {

    return (
        //  <AuthProvider>
                <RouterProvider router={router} />
        // </AuthProvider>
    )
    
}

export default App


