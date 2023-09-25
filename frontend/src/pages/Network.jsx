import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import classes from "./Network.module.css";
import FollowItem from "../components/item/FollowItem";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { url } from "../store/store";
import { useSelector } from "react-redux";

function Network() {
  const userInfo = useSelector((state) => state.user);

  const [myNetwork, setMyNetwork] = useState([]);
  const [allNetwork, setAllNetwork] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchMyNetwork = async () => {
      setLoading1(true);
      try {
        const { data } = await axios.get(
          `${url}/my/network?id=${userInfo.userInfo._id}`,
          {
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );

        setMyNetwork(data.usersData);
        setLoading1(false);
      } catch (error) {
        setLoading1(false);
        console.log("error in Networkjs");
      }
    };
    const fetchAllNetwork = async () => {
      setLoading2(true);
      try {
        const { data } = await axios.get(`${url}/all/network`, {
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        });

        setAllNetwork(data.user);
        setLoading2(false);
      } catch (error) {
        setLoading2(false);
        console.log("error in network.jsx");
      }
    };

    if (userInfo && userInfo.userInfo) fetchMyNetwork();
    if (userInfo && userInfo.userInfo) fetchAllNetwork();
  }, [userInfo]);

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.container2}>
          <div className={classes.heading1}>My Network</div>
          <div className={classes.heading2}>
            Popular you follow across LinkedIn
          </div>
          {loading1 ? (
            <div className={classes.loadingText}>...loading</div>
          ) : (
            <div className={classes.peopleContainer}>
              {myNetwork.map((item) => (
                <FollowItem
                  key={item._id}
                  id={item._id}
                  name={item.username}
                  designation={item.designation}
                  profileImage={item.profileImage}
                  backgroundImage={item.backgroundImage}
                  check={false}
                />
              ))}
            </div>
          )}

          {!loading1 && myNetwork.length == 0 && (
            <div className={classes.loadingText}>No Network Found!</div>
          )}
          <div className={classes.heading1}>All Network</div>
          <div className={classes.heading2}>
            Popular people to follow across LinkedIn
          </div>
          {loading1 && loading2 ? (
            <div className={classes.loadingText}>..loading</div>
          ) : (
            <div className={classes.peopleContainer}>
              {allNetwork.map((item) => {
                let check = true;
                myNetwork.map((user) => {
                  if (user._id == item._id) check = false;
                });
                return (
                  <FollowItem
                    key={item._id}
                    id={item._id}
                    name={item.username}
                    designation={item.designation}
                    profileImage={item.profileImage}
                    backgroundImage={item.backgroundImage}
                    check={check}
                    exception={
                      item._id === userInfo.userInfo._id ? true : false
                    }
                  />
                );
              })}
            </div>
          )}
          <div className={classes.moreButton}>
            <div className={classes.buttonText}>
              More
              <ArrowForwardIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Network;
