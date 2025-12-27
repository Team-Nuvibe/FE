import './App.css'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([{
    path : "/",
    // element : <HomeLayout/>,
    // errorElement : <NotFoundPage/>,
    children : [
        // { index: true, element: <HomePage/> },
        { path: "login", element: <LoginPage/> },
        { path: "signup", element: <SignUpPage/> },

    ]
    },
])
function App() {

    return <RouterProvider router={router} />;
    
}

export default App




      // <div className="relative flex flex-col w-full min-h-[100dvh]">
      // {/* 중앙 컨텐츠 영역 */}
      //   <main className="flex items-center justify-center">
      //     <Routes>      
      //       {/* 로그인 페이지 */}
      //       <Route path="/login" element={<LoginPage />} />
            
      //       {/* 회원가입 페이지 */}
      //       <Route path="/signup" element={<SignUpPage />} />
      //     </Routes>
      //   </main>
      // </div>
