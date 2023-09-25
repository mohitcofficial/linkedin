import React, { useState } from "react";

import classes from "./AddSkill.module.css";
import LoadingModal from "./LoadingModal";

import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../../store/store";

function EditBackground({ closeModal }) {
  const [loadingModal, setLoadingModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  const closeLoadingModal = () => {
    setLoadingModal(false);
  };

  const handleBackgroundChange = async () => {
    if (backgroundImage === "") {
      toast.warning("No Image Chosen", {
        position: "top-right",
      });
      return;
    }
    const myForm = new FormData();
    myForm.append("file", backgroundImage);
    setLoadingModal(true);
    // navigate("/home");

    try {
      const { data } = await axios.post(
        `${url}/profile/update/background`,
        myForm,
        {
          headers: {
            "Content-Type": `multipart/form-data; `,
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );

      setLoadingModal(false);
      // closeModal();
      toast.success("Background Updated Successfully!", {
        position: "top-right",
      });
      window.location.reload();
    } catch (error) {
      setLoadingModal(false);
      console.log("Error in Edit Background Modal");
    }
  };
  return (
    <>
      <ToastContainer style={{ zIndex: "2000" }} autoClose={2000} />
      {loadingModal && <LoadingModal closeModal={closeLoadingModal} />}
      <div className={classes.modalWrapper}></div>
      <div className={classes.modalContainer}>
        <div className={classes.container1}>
          <div>Choose New Background Image</div>
          <CloseIcon
            onClick={closeModal}
            sx={{ fontSize: "32px", cursor: "pointer" }}
          />
        </div>
        <input
          name="file"
          onChange={(e) => setBackgroundImage(e.target.files[0])}
          className={classes.fileInput}
          type="file"
        />
        <div className={classes.buttons}>
          <div onClick={closeModal} className={classes.closeButton}>
            CLOSE
          </div>
          <div onClick={handleBackgroundChange} className={classes.addButton}>
            CHANGE
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBackground;
