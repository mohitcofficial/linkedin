import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url } from "../../store/store";
import LoadingModal from "./LoadingModal";
import classes from "./EditProfile.module.css";

function ImageUploadModal({ closeModal }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const closeLoadingModal = () => {
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (caption.length < 1) {
      toast.warning("Caption Cannot Be Empty !", {
        position: "top-right",
      });
      return;
    }
    if (image === "") {
      toast.warning("Choose File To Upload !", {
        position: "top-right",
      });
      return;
    }

    const myForm = new FormData();

    myForm.append("caption", caption);
    myForm.append("file", image);

    try {
      setLoading(true);
      const { data } = await axios.post(`${url}/image/upload`, myForm, {
        headers: {
          "Content-Type": `multipart/form-data; `,
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      });
      setLoading(false);
      toast.success("Image Uploaded Successfully !", {
        position: "top-right",
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something Went Wrong !", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && <LoadingModal closeModal={closeLoadingModal} />}
      <div className={classes.modalWrapper}></div>
      <div className={classes.modalContainer}>
        <div className={classes.container1}>
          <div>Add New Skill</div>
          <CloseIcon
            onClick={closeModal}
            sx={{ fontSize: "32px", cursor: "pointer" }}
          />
        </div>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className={classes.inputField}
          type="text"
          placeholder="Enter the caption"
        />
        <div className={classes.subHeading}>Profile Image</div>
        <input
          name="file"
          onChange={(e) => setImage(e.target.files[0])}
          className={classes.fileInput}
          type="file"
        />
        <div className={classes.buttons}>
          <div onClick={closeModal} className={classes.closeButton}>
            CLOSE
          </div>
          <div onClick={handleImageUpload} className={classes.addButton}>
            ADD
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageUploadModal;
