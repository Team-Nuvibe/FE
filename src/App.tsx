import './App.css'
import SignUpPage from './Pages/SignUpPage'



function App() {

  return (
    <>
      <div className="relative flex flex-col w-full min-h-[100dvh]">
      {/* 중앙 컨텐츠 영역 */}
        <main className="flex items-center justify-center">
          <SignUpPage />
        </main>
    </div>
    </>
  )
}

export default App
