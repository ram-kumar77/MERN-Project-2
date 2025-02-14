import React, { useState, useEffect, useRef } from "react";
import { useHistory, Redirect } from "react-router-dom"; // Added Redirect import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCaretDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

function DefaultLayout(props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const history = useHistory();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (user) {
        const currentPath = window.location.pathname;
        if (currentPath === '/') {
            if (user.isAdmin) {
                history.push('/admin');
            }
        } else if (currentPath === '/admin' && !user.isAdmin) {
            history.push('/');
        }
    }
}, [user, history]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      // Clear all user-related data
      localStorage.removeItem('user');
      setUser(null);
      setIsOpen(false);
      
      // Force a full page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to regular redirect if full reload fails
      history.push('/login');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    history.push(path);
  };

  const navigateHome = () => {
    if (user?.isAdmin) {
      history.push("/admin");
    } else {
      history.push("/");
    }
  };

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <div className="navbar bg-gray-800 p-4 relative z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {user?.isAdmin && (
              <button
                onClick={() => history.goBack()}
                className="text-white mr-4 hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <button 
              onClick={navigateHome}
              className="logo text-white text-3xl text-bold  flex items-center"
            >
              <FontAwesomeIcon 
                icon={faCar}
                className="mr-2" 
              />
              <span>{user?.isAdmin ? "Admin Panel" : "Carzz"}</span>
            </button>
          </div>

          <div className="navItems relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors focus:outline-none"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
              <span>{user?.username || 'User'}</span>
              <FontAwesomeIcon 
                icon={faCaretDown} 
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
  <div 
    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden"
    style={{ zIndex: 1000 }}
  >
    <button 
      onClick={() => handleNavigate(user?.isAdmin ? "/admin" : "/")}
      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
    >
      {user?.isAdmin ? "Dashboard" : "Home"}
    </button>
    {!user?.isAdmin && (
      <button 
        onClick={() => handleNavigate("/userbookings")}
        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
      >
        My Bookings
      </button>
    )}
    <hr className="my-1 border-gray-200" />
    <button 
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
    >
      Logout
    </button>
  </div>
)}
          </div>
        </div>
      </div>
      <div className="content p-4">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;