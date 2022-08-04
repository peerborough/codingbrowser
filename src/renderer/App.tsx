import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import 'antd/dist/antd.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
