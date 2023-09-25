import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import SidePoster from "../assets/SidePoster.svg";
import Logo1 from "../assets/Logo1.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../store/socket";
import { loadUserFail, loadUserSuccess } from "../store/userSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingModal from "../components/modal/LoadingModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     email.length >= 12 &&
  //     email.length <= 30 &&
  //     password.length >= 6 &&
  //     password.length <= 16
  //   )
  //     setCheck(true);
  //   else setCheck(false);
  // }, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!check) {
      toast.warning("Enter Both The Fields Carefully", {
        position: "top-center",
      });
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `http://localhost:4000/api/login`,
          {
            email,
            password,
          },
          {
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );

        setLoading(false);
        dispatch(loadUserSuccess(data.user));
        socket.emit("user-joined", data.user);
        navigate("/home");
        toast.success(`Welcome Back ${data.user.username}`, {
          position: "top-center",
        });
      } catch (e) {
        setLoading(false);
        dispatch(loadUserFail());
        toast.error("Invalid Email or Password", {
          position: "top-center",
        });
        console.log(e);
      }
    }

    setEmail("");
    setPassword("");
  };

  const closeLoadingModal = () => {
    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      {loading && <LoadingModal closeModal={closeLoadingModal} />}
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <div className={classes.logoContainer}>
            <img className={classes.logo} src={Logo1} alt="" />
            <div className={classes.sideText}>For Students</div>
          </div>
          <div className={classes.heading1}>
            Welcome To Your Professional Community
          </div>

          <form className={classes.loginForm} onSubmit={handleSubmit}>
            <label className={classes.textLabel}> E-mail </label>
            <input
              className={classes.emailInput}
              type="text"
              placeholder="Enter the E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label className={classes.textLabel}> Password </label>
            <input
              className={classes.passwordInput}
              type="password"
              placeholder="Enter the password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className={classes.loginButton}>Login</button>
            <div className={classes.newUserContainer}>
              <div style={{ fontSize: "16px" }}>New User</div>
              <div
                onClick={() => {
                  navigate("/signup");
                }}
                className={classes.signUpButton2}
              >
                Sign Up
              </div>
            </div>
          </form>
        </div>
        <div className={classes.rightContainer}>
          <div className={classes.posterContainer}>
            <img className={classes.poster} src={SidePoster} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
