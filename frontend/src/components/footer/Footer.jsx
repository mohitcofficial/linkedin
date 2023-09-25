import React from "react";
import classes from "./Footer.module.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <div className={classes.container}>
      <div className={classes.container2}>
        <ul className={classes.list}>
          <li className={classes.listItem}>Terms Of Use</li>
          <li className={classes.listItem}>Privacy Policy</li>
          <li className={classes.listItem}>About</li>
          <li className={classes.listItem}>FAQ</li>
        </ul>
        <div className={classes.description}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
          officiis culpa adipisci dolorum laborum omnis obcaecati eos quam porro
          sit pariatur incidunt distinctio corrupti ipsam quas eius dignissimos
          nisi. Quae aperiam quis sunt, doloribus repudiandae maiores
          exercitationem nam aliquid adipisci itaque similique harum ea neque
          sit dignissimos culpa illo cumque?
        </div>
        <div className={classes.socialMediaHandles}>
          <FacebookIcon className={classes.icon} />
          <InstagramIcon className={classes.icon} />
          <TwitterIcon className={classes.icon} />
          <LinkedInIcon className={classes.icon} />
        </div>
      </div>
    </div>
  );
}

export default Footer;
