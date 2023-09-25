import React from "react";
import classes from "./FollowItem.module.css";
import axios from "axios";
import { url } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Avatar from "../../assets/avatar.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FollowItem({
  name,
  designation,
  profileImage,
  backgroundImage,
  check,
  id,
  exception,
}) {
  const userInfo = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleFollow = () => {
    console.log("clicked!");
    if (!userInfo || !userInfo.userInfo) {
      alert("Some Error Occured! Try Again Later");
    }
    try {
      const { data } = axios.post(
        `${url}/my/network/add`,
        {
          userId1: userInfo.userInfo._id,
          userId2: id,
        },
        {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );
      toast.success("Successfully Added To Your Network", {
        position: "top-right",
      });
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };
  const handleMessage = () => {
    // console.log("clicked!");
    if (!userInfo || !userInfo.userInfo) {
      alert("Some Error Occured! Try Again Later");
    }
    try {
      const { data } = axios.post(
        `${url}/conversation/create`,
        {
          id1: userInfo.userInfo._id,
          id2: id,
        },
        {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );
      console.log(data);
      toast.success("Successfully Added To Messages", {
        position: "top-right",
      });
      navigate("/messages");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <ToastContainer autoClose={2000} />
      {backgroundImage && backgroundImage.length > 0 ? (
        <img
          className={classes.backgroundImage}
          src={backgroundImage[0].url}
          alt=""
        />
      ) : (
        <img className={classes.backgroundImage} src="" alt="" />
      )}
      {profileImage && profileImage.length > 0 ? (
        <img
          className={classes.profileImage}
          src={profileImage[0].url}
          alt=""
        />
      ) : (
        <img className={classes.profileImage} src={Avatar} alt="" />
      )}
      <div className={classes.infoContainer}>
        <div className={classes.username}>{name}</div>
        <div className={classes.designation}> {designation}</div>
      </div>
      {!exception && check && (
        <div onClick={handleFollow} className={classes.followButton}>
          Follow
        </div>
      )}
      {!exception && !check && (
        <div onClick={handleMessage} className={classes.messageButton}>
          Message
        </div>
      )}
      {exception && <div>You</div>}
    </div>
  );
}

export default FollowItem;
