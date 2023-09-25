import React, { useEffect, useState } from "react";
import classes from "./Home.module.css";
import Header from "../components/header/Header";
import Avatar from "../assets/avatar.png";
import Background from "../assets/Background.jpg";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ImageIcon from "@mui/icons-material/Image";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { url } from "../store/store";
import axios from "axios";

function Home() {
  const [like, setLike] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [description, setDescription] = useState(null);
  const [allNetwork, setAllNetwork] = useState([]);
  const [loading1, setLoading1] = useState(true);

  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllNetwork = async () => {
      setLoading1(true);
      try {
        const { data } = await axios.get(`${url}/all/network`, {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        });

        setAllNetwork(data.user);
        setLoading1(false);
      } catch (error) {
        setLoading1(false);
        console.log("error in network.jsx");
      }
    };
    if (userInfo && userInfo.userInfo) fetchAllNetwork();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.userInfo) {
      if (userInfo.userInfo.backgroundImage.length > 0) {
        setBackgroundImage(userInfo.userInfo.backgroundImage[0].url);
      }
      if (userInfo.userInfo.profileImage.length > 0) {
        setProfileImage(userInfo.userInfo.profileImage[0].url);
      }
      if (userInfo.userInfo.description) {
        setDescription(userInfo.userInfo.description);
      }
    }
  }, [userInfo]);

  const handleLike = () => {
    setLike((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.container1}>
          {backgroundImage ? (
            <img
              className={classes.backgroundImage}
              src={backgroundImage}
              alt=""
            />
          ) : (
            <img className={classes.backgroundImage} src={Background} alt="" />
          )}
          {profileImage ? (
            <img className={classes.profileImage} src={profileImage} alt="" />
          ) : (
            <img className={classes.profileImage} src={Avatar} alt="" />
          )}
          <div className={classes.textContainer}>
            <div className={classes.username}>
              {userInfo && userInfo.userInfo
                ? userInfo.userInfo.username
                : "Your Name"}
            </div>
            {description ? (
              <div className={classes.info}>{description}</div>
            ) : (
              <div className={classes.info}></div>
            )}
          </div>
        </div>
        <div className={classes.container2}>
          <div className={classes.box}>
            <div className={classes.box1}>
              <img className={classes.profileImage2} src={Avatar} alt="" />
              <input
                className={classes.input1}
                placeholder="New Publication"
                type="text"
              />
            </div>
            <div className={classes.box2}>
              <div className={classes.icons}>
                <ImageIcon className={classes.imageIcon} />
                <div>Photo</div>
              </div>
              <div className={classes.icons}>
                <PlayCircleIcon className={classes.videoIcon} />
                <div>Video</div>
              </div>
            </div>
          </div>
          <div className={classes.post}>
            <div className={classes.uploaderInfo}>
              <img
                className={classes.profileImageUploader}
                src={Avatar}
                alt=""
              />
              <div className={classes.uploaderName}>Creator Name</div>
            </div>
            <div className={classes.imageInfo}>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              autem eius itaque quasi! Neque, quia?
            </div>
            <img
              className={classes.uploadedImage}
              src="https://img.freepik.com/free-vector/flat-design-lake-scenery_23-2149161405.jpg?w=2000"
              alt=""
            />
            <div className={classes.text2}>
              {" "}
              Liked by dknsondd fnsndfios dnfsdinfsfos
            </div>
            <div className={classes.buttons}>
              <div onClick={handleLike} className={classes.button}>
                {!like ? <ThumbUpOffAltIcon /> : <ThumbUpAltIcon />}
                Like
              </div>
              <div className={classes.button}>
                <ChatBubbleOutlineIcon />
                Comment
              </div>
              <div className={classes.button}>
                <SendIcon />
                Send
              </div>
            </div>
          </div>
        </div>
        <div className={classes.container3}>
          <div className={classes.feedHeading}>Add to your feed</div>
          {loading1 && <>...loading</>}
          {!loading1 && allNetwork.length == 0 && (
            <>No Recommendations Found!</>
          )}
          {!loading1 &&
            allNetwork.length > 0 &&
            allNetwork.map((item) => (
              <div key={item._id} className={classes.people}>
                <img src={item.profileImage[0].url} alt="" />
                <div style={{ margin: "0 12px" }}>{item.username}</div>
              </div>
            ))}

          <div
            onClick={() => {
              navigate("/network");
            }}
            className={classes.seeAll}
          >
            See All Recommendations
            <ArrowForwardIcon />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
