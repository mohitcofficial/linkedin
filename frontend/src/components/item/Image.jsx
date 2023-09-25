import React from "react";
import classes from "./Image.module.css";
import { saveAs } from "file-saver";

function Image({ id, caption, url, likeCount }) {
  const downloadImageHandler = () => {
    saveAs(url, "image.jpg");
  };

  const deleteImageHandler = () => {};

  return (
    <div className={classes.container}>
      <img className={classes.image} src={url} alt="" />
      <div className={classes.likeCount}>Like Count: {likeCount}</div>
      <div className={classes.caption}>{caption}</div>
      <div className={classes.buttons}>
        <div onClick={deleteImageHandler} className={classes.deleteButton}>
          Delete
        </div>
        <div onClick={downloadImageHandler} className={classes.downloadButton}>
          Download
        </div>
      </div>
    </div>
  );
}

export default Image;
