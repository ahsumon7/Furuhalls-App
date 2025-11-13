import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage'; // Import the new component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        {/* Add more routes here as needed */}
        <Route path='/' element={<Navigate to='/login' replace />} />
              
        {/* New Dashboard Route */}
        <Route path='/dashboard' element={<DashboardPage />} />
        
        {/* Default route redirects to the dashboard */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
      </Routes>

    </Router>
  );
}

export default App;
