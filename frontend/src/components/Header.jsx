// src/components/Header.jsx
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/about');
  };

  return (
    //Change "#"
    <header>
      <div className="logo_header">
        <img src="public/images/LOGO (1).png" alt="PassanGo" />
        <h1>PassanGo</h1>
      </div>
      <SearchBar/>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <a href="#" onClick={() => navigate('/inside')} className='Header_a'>
                  Home
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate('/create')} className='Header_a'>
                  Create
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate('/profile')} className='Header_a'>
                  Profile
                </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="#" onClick={() => navigate('/')} className='Header_a'>
                  Home
                </a>
              </li>
              <li>
                <a href="/login" onClick={() => navigate('/login')} className='Header_a'>
                  Log In
                </a>
              </li>
              <li>
                <a href="/signup" onClick={() => navigate('/signup')} className='Header_a'>
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;