import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateRule from './components/CreateRule'
import CombineRules from './components/CombineRules'
import CheckEligibility from './components/CheckEligibility'
import ViewRule from './components/ViewRule'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
            <Routes>
              <Route path="/" element={<CreateRule />} />
              <Route path="/combine" element={<CombineRules />} />
              <Route path="/check" element={<CheckEligibility />} />
              <Route path="/view" element={<ViewRule />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
