import React, { useEffect, useState } from "react";
import classes from "./ChatPerson.module.css";
import axios from "axios";
import { url } from "../../store/store";
import { useDispatch } from "react-redux";
import { setChatperson } from "../../store/chatPersonSlice";

function ChatPerson({ id }) {
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${url}/user/${id[0]}`, {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        });
        setLoading(false);
        setUser(data.user);
        setConversationId(id[1]);
      } catch (error) {
        console.log("Error in Chatperson.jsx");
        setLoading(false);
        console.log(error);
      }
    };

    id && getUserDetails();
  }, [id]);

  const handleClick = () => {
    dispatch(setChatperson({ user, conversationId }));
  };

  return (
    <>
      {!loading ? (
        <div onClick={handleClick} className={classes.container}>
          {user.profileImage && user.profileImage.length > 0 ? (
            <img
              className={classes.image}
              src={user.profileImage[0].url}
              alt=""
            />
          ) : (
            <img className={classes.image} src="" alt="" />
          )}
          <div className={classes.info}>
            <div className={classes.name}>{user.username}</div>
            <div className={classes.lastMessage}>Last message</div>
          </div>
          <div className={classes.time}>time</div>
        </div>
      ) : (
        <div className={classes.skeletonContainer}>
          <div className={classes.imageSkeleton}></div>
          <div className={classes.infoSkeleton}>
            <div className={classes.nameSkeleton}></div>
            <div className={classes.lastMessageSkeleton}></div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatPerson;
