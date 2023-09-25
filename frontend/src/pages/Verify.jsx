import axios from "axios";
import React, { useEffect, useState } from "react";

function Verify() {
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUrl = window.location.href;
  const parts = currentUrl.split("/");
  const lastElement = parts[parts.length - 1];

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `http://localhost:4000/api/verify`,
          {
            token: lastElement,
          },
          {
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );
        console.log(data);
        setFound(true);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setFound(false);
      }
    };
    verifyUser();
  }, []);

  return (
    <>
      Here
      {!loading && found && <h2>Account Verified</h2>}
      {!loading && !found && <h2>Token Expired Try Again!</h2>}
    </>
  );
}

export default Verify;
