import React, {useEffect} from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useStateValue } from "./provider/StateProvider";
import Header from './components/header/Header';
import Login from './components/login/Login';
import Toast from './components/toast/Toast';
import Landing from './components/LandingPage/Landing';
import Home from './components/Home';


function App() {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Running App..")
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          // Token expired
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          dispatch({
            type: "ADD_USER",
            user: null
          });

          dispatch({
            type: "TOAST_MESSAGE",
            toast: "Session Expired please login !"
          });

          navigate("/login")

        } else {
          // Token is valid
          dispatch({
            type: "ADD_USER",
            user: user,
          });

        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const paths = [
    {path: "/", element : <Landing /> , authRequired : false},
    {path: "/login", element : <Login /> , authRequired : false},
    {path: "/u/activity", element : <Home /> , authRequired : false},

    // Navigate all unknown pages to Home Page:
    {path: "*", element : <Navigate to="/" />, authRequired : false}
  ]

  return (
    <div className="App">
      <Header/> 
      <Toast />
      <Routes>
        {paths && 
          paths.map((routes, index) => (
            <Route path={routes.path} element={routes.element} key={`Route_dir_${index}`}/>
          ))
        }
      </Routes>
    </div>
  );
}

export default App;
