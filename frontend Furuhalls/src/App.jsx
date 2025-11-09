import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        {/* Add more routes here as needed */}
        <Route path='/' element={<Navigate to='/login' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
