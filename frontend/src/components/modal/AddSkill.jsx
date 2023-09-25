import React, { useState } from "react";
import classes from "./AddSkill.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url } from "../../store/store";
import LoadingModal from "./LoadingModal";

function AddSkill({ closeModal }) {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSkillAdd = async () => {
    if (skill.length == 0) {
      toast.warning("Skill Cannot Be Empty !", {
        position: "top-right",
      });

      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${url}/add/skill`,
        {
          skill: skill,
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
      setSkill("");
      toast.success("Skill Added Successfully !", {
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
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter the skill"
          className={classes.skillInput}
          type="text"
        />
        <div className={classes.buttons}>
          <div onClick={closeModal} className={classes.closeButton}>
            CLOSE
          </div>
          <div onClick={handleSkillAdd} className={classes.addButton}>
            ADD
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSkill;
