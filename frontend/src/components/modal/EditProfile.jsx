import React, { useState } from "react";
import classes from "./EditProfile.module.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { url } from "../../store/store";
import LoadingModal from "./LoadingModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile({ closeModal }) {
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImge] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const handleEditProfile = async () => {
    const myForm = new FormData();

    if (username.length > 0) {
      myForm.append("username", username);
    }
    if (description.length > 0) {
      myForm.append("description", description);
    }
    if (designation.length > 0) {
      myForm.append("designation", designation);
    }

    if (profileImage != "") {
      myForm.append("file", profileImage);
    }

    setLoadingModal(true);
    // navigate("/home");

    try {
      const { data } = await axios.post(`${url}/profile/update`, myForm, {
        headers: {
          "Content-Type": `multipart/form-data; `,
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      });

      setLoadingModal(false);
      // closeModal();
      toast.success("Profile Updated Successfully!", {
        position: "top-right",
      });
      window.location.reload();
    } catch (error) {
      setLoadingModal(false);
      console.log("Error in Edit Profile Modal");
    }
  };

  const closeLoadingModal = () => {
    setLoadingModal(false);
  };

  return (
    <>
      <ToastContainer style={{ zIndex: "2000" }} autoClose={2000} />
      {loadingModal && <LoadingModal closeModal={closeLoadingModal} />}
      <div className={classes.modalWrapper}></div>
      <div className={classes.modalContainer}>
        <div className={classes.container1}>
          <div>Only enter the details you want to change</div>
          <CloseIcon
            onClick={closeModal}
            sx={{ fontSize: "32px", cursor: "pointer" }}
          />
        </div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={classes.inputField}
          type="text"
          placeholder="Enter the new username"
        />
        <input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className={classes.inputField}
          type="text"
          placeholder="Enter the new designaiton"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={classes.inputField}
          type="text"
          placeholder="Enter the new description"
        />
        <div className={classes.subHeading}>Profile Image</div>
        <input
          name="file"
          onChange={(e) => setProfileImge(e.target.files[0])}
          className={classes.fileInput}
          type="file"
        />

        <div className={classes.buttons}>
          <div onClick={closeModal} className={classes.closeButton}>
            CLOSE
          </div>
          <div onClick={handleEditProfile} className={classes.addButton}>
            CHANGE
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
