import classes from "./App.module.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Network from "./pages/Network";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "protected-route-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Verify from "./pages/Verify";
import { useDispatch, useSelector } from "react-redux";
import { loginFail, loginSuccess } from "./store/userSlice";
import Blank from "./pages/Blank";
import { url } from "./store/store";
import socket from "./store/socket";
import LoadingBar from "react-top-loading-bar";
import Uploads from "./pages/Uploads";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const userInfo = useSelector((state) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout1 = setTimeout(() => {
      setProgress(40);
      const timeout2 = setTimeout(() => {
        setProgress(100);
      }, 50);
      return () => clearTimeout(timeout2);
    }, 100);

    return () => {
      setProgress(0);
      clearInterval(timeout1);
    };
  }, [location]);

  const remainingURL = location.pathname + location.search;

  useEffect(() => {
    if (userInfo) setIsAuthenticated(true);
    else setIsAuthenticated(false);
  }, [userInfo]);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/me/`, {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        });
        dispatch(loginSuccess(data.user));
        setLoading(false);
        if (remainingURL === "/") {
          navigate("/home");
        } else {
          navigate(`${remainingURL}`);
        }
        socket.emit("user-joined", data.user);
      } catch (e) {
        dispatch(loginFail());
        setLoading(false);
        console.log(e);
      }
    };
    loadUser();
  }, []);

  return (
    <div className={classes.container}>
      <LoadingBar
        color="rgb(0, 160, 223)"
        progress={progress}
        waitingTime={300}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
      <Routes>
        <Route exact path="/" element={loading ? <Blank /> : <Login />} />
        <Route path="/verify/:token" element={<Verify />} />
        {!loading && <Route exact path="/signup" element={<SignUp />} />}
        <Route
          exact
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/network"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
              <Network />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/messages"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/uploads"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
              <Uploads />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
