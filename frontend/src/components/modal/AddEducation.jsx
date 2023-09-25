import React, { useState } from "react";

import classes from "./AddSkill.module.css";
import CloseIcon from "@mui/icons-material/Close";
import LoadingModal from "./LoadingModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { url } from "../../store/store";

function AddEducation({ closeModal }) {
  const [education, setEducation] = useState("");

  const [loading, setLoading] = useState(false);

  const handleEducationAdd = async () => {
    if (education.length == 0) {
      toast.warning("Education Field Cannot Be Empty !", {
        position: "top-right",
      });

      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${url}/add/education`,
        {
          education: education,
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
      setEducation("");
      toast.success("Education Added Successfully !", {
        position: "top-right",
      });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something Went Wrong !", {
        position: "top-right",
      });
    }
  };

  const closeLoadingModal = () => {
    setLoading(false);
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      {loading && <LoadingModal closeModal={closeLoadingModal} />}
      <div className={classes.modalWrapper}></div>
      <div className={classes.modalContainer}>
        <div className={classes.container1}>
          <div>Add New Education</div>
          <CloseIcon
            onClick={closeModal}
            sx={{ fontSize: "32px", cursor: "pointer" }}
          />
        </div>
        <input
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Enter the education"
          className={classes.educationInput}
          type="text"
        />
        <div className={classes.buttons}>
          <div onClick={closeModal} className={classes.closeButton}>
            CLOSE
          </div>
          <div onClick={handleEducationAdd} className={classes.addButton}>
            ADD
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEducation;
