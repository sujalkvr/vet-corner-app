// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          {/* Add other routes */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;