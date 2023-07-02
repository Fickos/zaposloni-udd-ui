import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';
import Upload from './pages/Upload';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/upload" element={<Upload /> } />
    </Routes>
  );
}

export default App;
