import React, { useState } from "react";
import classes from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import Logo1 from "../assets/Logo1.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { registerFail, registerSuccess } from "../store/userSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingModal from "../components/modal/LoadingModal";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      toast.warn("Username Cannot Be Empty!", {
        position: "top-right",
      });
      return;
    }
    if (email === "") {
      toast.warn("Email Cannot Be Empty!", {
        position: "top-right",
      });
      return;
    }
    if (password === "") {
      toast.warn("Password Cannot Be Empty!", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:4000/api/signup`,
        {
          username: name,
          email: email,
          password: password,
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
      toast.info("Verify G-mail via link in G-mail", {
        position: "top-right",
      });
      dispatch(registerSuccess(data.user));
    } catch (e) {
      setLoading(false);
      toast.error("Something Went Wrong!", {
        position: "top-right",
      });
      console.log(e);
      dispatch(registerFail());
    }

    setEmail("");
    setName("");
    setPassword("");
  };

  const closeEditBackgroundModal = () => {
    setLoading(false);
  };

  return (
    <div className={classes.container}>
      <ToastContainer />
      {loading && <LoadingModal closeModal={closeEditBackgroundModal} />}
      <div className={classes.logoContainer}>
        <img className={classes.logo} src={Logo1} alt="" />
        <div className={classes.sideText}>For Students</div>
      </div>
      <form className={classes.signUpForm} onSubmit={handleSubmit}>
        <div className={classes.heading1}>Sign Up</div>
        <label className={classes.textLabel}> Username </label>
        <input
          className={classes.emailInput}
          type="text"
          placeholder="Enter the Username"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
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
        <button className={classes.signUpButton}>Sign Up</button>
        <div className={classes.newUserContainer}>
          <div style={{ fontSize: "16px" }}>Already a User?</div>
          <div
            onClick={() => {
              navigate("/");
            }}
            className={classes.signUpButton2}
          >
            Log In
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
