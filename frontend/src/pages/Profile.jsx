import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import classes from "./Profile.module.css";
import Avatar from "../assets/avatar.png";
import Background from "../assets/Background.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import AddSkill from "../components/modal/AddSkill";
import AddEducation from "../components/modal/AddEducation";
import EditProfile from "../components/modal/EditProfile";
import LoadingModal from "../components/modal/LoadingModal";
import EditBackground from "../components/modal/EditBackground";
import ImageUploadModal from "../components/modal/ImageUploadModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../store/store";

function Profile() {
  const userInfo = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [description, setDescription] = useState(null);

  const [addSkillModal, setAddSkillModal] = useState(false);
  const [addEducationModal, setAddEducationModal] = useState(false);
  const [editProfileModal, seteditProfileModal] = useState(false);
  const [editBackground, seTEditBackground] = useState(false);
  const [uploadImageModal, setUploadImageMOdal] = useState(false);

  const [userSkills, setUserSkills] = useState([]);
  const [userEducations, setuserEducations] = useState([]);
  const [allNetwork, setAllNetwork] = useState([]);
  const [loading1, setLoading1] = useState(true);

  const navigate = useNavigate();

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
      setUserSkills(userInfo.userInfo.skills);
      setuserEducations(userInfo.userInfo.education);
    }

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
      if (userInfo.userInfo.designation) {
        setDesignation(userInfo.userInfo.designation);
      }
    }
  }, [userInfo]);

  const closeAddSkillModal = () => {
    setAddSkillModal(false);
  };
  const closeAddEducationModal = () => {
    setAddEducationModal(false);
  };
  const closeEditProfileModal = () => {
    seteditProfileModal(false);
  };
  const closeEditBackgroundModal = () => {
    seTEditBackground(false);
  };
  const closeUploadImageModal = () => {
    setUploadImageMOdal(false);
  };

  return (
    <>
      <Header />
      {addSkillModal && <AddSkill closeModal={closeAddSkillModal} />}
      {addEducationModal && (
        <AddEducation closeModal={closeAddEducationModal} />
      )}
      {editProfileModal && <EditProfile closeModal={closeEditProfileModal} />}
      {editBackground && (
        <EditBackground closeModal={closeEditBackgroundModal} />
      )}
      {uploadImageModal && (
        <ImageUploadModal closeModal={closeUploadImageModal} />
      )}
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <div className={classes.profileInfoContainer}>
            {backgroundImage ? (
              <img
                className={classes.backgroundImage}
                src={backgroundImage}
                onClick={() => seTEditBackground(true)}
                alt=""
              />
            ) : (
              <img
                className={classes.backgroundImage}
                src={Background}
                onClick={() => seTEditBackground(true)}
                alt=""
              />
            )}
            {profileImage ? (
              <img className={classes.profileImage} src={profileImage} alt="" />
            ) : (
              <img className={classes.profileImage} src={Avatar} alt="" />
            )}
            <div className={classes.infoContainer}>
              <div className={classes.username}>
                {userInfo.userInfo
                  ? userInfo.userInfo.username
                  : "Your Username"}
              </div>
              <div className={classes.email}>
                {" "}
                {userInfo.userInfo ? userInfo.userInfo.email : "Your EMail"}
              </div>
              {designation ? (
                <div className={classes.designation}> ({designation})</div>
              ) : (
                <div className={classes.designation}></div>
              )}
              {description ? (
                <div className={classes.about}>
                  {userInfo.userInfo.description}
                </div>
              ) : (
                <div className={classes.about}></div>
              )}
              <button
                onClick={() => seteditProfileModal(true)}
                style={{ outline: "none", width: "100px", margin: "0 32px" }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className={classes.buttons}>
            <div
              onClick={() => setUploadImageMOdal(true)}
              className={classes.uploadButton}
            >
              UPLOAD IMAGE
            </div>
            <div
              onClick={() => navigate("/uploads")}
              className={classes.yourUploadsButton}
            >
              YOUR UPLOADS
            </div>
          </div>
          <div className={classes.skillsContainer}>
            <div className={classes.heading2}>
              <div>Skills</div>
              <div
                onClick={() => setAddSkillModal(true)}
                className={classes.addSkillButton}
              >
                <AddIcon className={classes.icon} />
              </div>
            </div>
            <div className={classes.educationList}>
              {userSkills.map((skill, index) => (
                <div key={index}>
                  <div className={classes.skill}>{skill}</div>
                  <div
                    style={{
                      width: "100%",
                      background: "rgb(219, 219, 219)",
                      height: "2px",
                      margin: "12px 0",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          <div className={classes.educationContainer}>
            <div className={classes.heading2}>
              <div>Education</div>
              <div
                onClick={() => setAddEducationModal(true)}
                className={classes.addSkillButton}
              >
                <AddIcon className={classes.icon} />
              </div>
            </div>
            <div className={classes.educationList}>
              {userEducations.map((education, index) => (
                <div key={index}>
                  <div className={classes.education}>{education}</div>
                  <div
                    style={{
                      width: "100%",
                      background: "rgb(219, 219, 219)",
                      height: "2px",
                      margin: "12px 0",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.rightContainer}>
          <img className={classes.image} src={Avatar} alt="" />
          <div className={classes.peopleContainer}>
            <div style={{ margin: "12px 0" }}>People You May Know</div>
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
      </div>
    </>
  );
}

export default Profile;
