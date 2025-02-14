
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import UserBookings from './pages/UserBookings';
import BookingCar from './pages/BookingCar';
import AddCar from './pages/AddCar'; // Make sure this import exists
import EditCar from './pages/EditCar'; // Make sure this import exists
import Register from './pages/Register';

function App() {
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  });

  // Update user state when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')) || null);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // Protected Route Component
  const ProtectedRoute = ({ component: Component, isAdmin, ...rest }) => {
    if (!user) {
      return <Redirect to="/login" />;
    }

    return (
      <Route
        {...rest}
        render={props => {
          if (isAdmin && !user.isAdmin) {
            return <Redirect to="/" />;
          }
          if (!isAdmin && user.isAdmin) {
            return <Redirect to="/admin" />;
          }
          return <Component {...props} />;
        }}
      />
    );
  };

  return (
    <Router>
<Switch>
        {/* Public Routes */}
        <Route 
          exact 
          path="/login" 
          render={() => (user ? <Redirect to={user.isAdmin ? "/admin" : "/"} /> : <Login />)}
        />
        <Route 
          exact 
          path="/register" 
          render={() => (user ? <Redirect to={user.isAdmin ? "/admin" : "/"} /> : <Register />)}
        />

        {/* Admin Routes */}
        <ProtectedRoute exact path="/admin" component={AdminHome} isAdmin={true} />
        <ProtectedRoute exact path="/addcar" component={AddCar} isAdmin={true} />
        <ProtectedRoute exact path="/editcar/:carid" component={EditCar} isAdmin={true} />

        {/* User Routes */}
        <ProtectedRoute exact path="/" component={Home} isAdmin={false} />
        <ProtectedRoute exact path="/userbookings" component={UserBookings} isAdmin={false} />
        <ProtectedRoute exact path="/booking/:carid" component={BookingCar} isAdmin={false} />

        {/* Fallback Route */}
        <Route path="*">
          <Redirect to={user?.isAdmin ? "/admin" : "/"} />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;