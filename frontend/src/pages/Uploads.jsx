import React, { useEffect, useState } from "react";
import classes from "./Uploads.module.css";
import Header from "../components/header/Header";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../store/store";
import Image from "../components/item/Image";

function Uploads() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchMyPhotos = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${url}/my/uploads`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        });

        setLoading(false);
        setImages(data.imageArray);
      } catch (error) {
        setLoading(false);
        toast.error("Something Went Wrong !", {
          position: "top-right",
        });
        console.log(error);
      }
    };

    fetchMyPhotos();
  }, []);

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.container1}>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className={classes.backButton}
          >
            <ArrowBackIcon />
            BACK
          </button>
        </div>
        <div className={classes.container2}>
          <div className={classes.heading}>Your Uploads</div>
          <div className={classes.container3}>
            {images.map((image) => (
              <Image
                key={image._id}
                id={image._id}
                url={image.image.url}
                caption={image.caption}
                likeCount={image.likedBy.length}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Uploads;
