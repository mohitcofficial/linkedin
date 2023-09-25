import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header/Header";
import classes from "./Message.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ChatPerson from "../components/item/ChatPerson";
import { url } from "../store/store";
import socket from "../store/socket";

function Message() {
  const userInfo = useSelector((state) => state.user);
  const chatPerson = useSelector((state) => state.chatperson);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [ids, setIds] = useState([]);
  const [status, setStatus] = useState("Offline");
  const [typingStatus, setTypingStatus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading1(true);
        const { data } = await axios.get(
          `http://localhost:4000/api/conversations/${userInfo.userInfo._id}`,
          {
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );
        setLoading1(false);
        // console.log(data);
        let temp = [];
        if (data.conversations) {
          data.conversations.map((conversation) => {
            let currArray = conversation.users;
            if (currArray[0] != userInfo.userInfo._id) {
              temp.push([currArray[0], conversation._id]);
            } else {
              temp.push([currArray[1], conversation._id]);
            }
          });
        }

        setIds(temp);
      } catch (error) {
        setLoading1(false);
        console.log("error in Message js");
        console.log(error);
      }
    };

    userInfo && fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]);
      try {
        setLoading2(true);
        const { data } = await axios.get(
          `${url}/messages/${chatPerson.conversationId}`,
          {
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );
        setLoading2(false);
        const reversed = data.messages.reverse();
        setMessages(reversed);
      } catch (error) {
        setLoading2(false);
        console.log("Error in message.jsx 3");
      }
    };

    userInfo && chatPerson && chatPerson.conversationId && fetchMessages();
  }, [chatPerson]);

  const checkStatus = async (id) => {
    try {
      const { data } = await axios.get(`${url}/user/status/${id}`, {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      });

      setStatus(data.status);
    } catch (error) {
      console.log("error in message js check status");
    }
  };

  useEffect(() => {
    if (chatPerson && chatPerson.chatPersonInfo) {
      checkStatus(chatPerson.chatPersonInfo._id);
    }
  }, [chatPerson]);

  useEffect(() => {
    socket.on("message-sent", (data) => {
      // console.log(data.messageId, data.status);
      // console.log("message sent");
    });
    socket.on("message-received", (data) => {
      setMessages([...messages, data]);
    });
    socket.on("check", (data) => {
      console.log(data.value);
    });

    socket.on("typing", () => {
      // console.log("user is typing");
      setTypingStatus(true);
    });
    socket.on("stop-typing", () => {
      // console.log("user stopped typing");
      setTypingStatus(false);
    });
    socket.on("user-connected", () => {
      // console.log("User has connected");
      setStatus("Online");
    });

    socket.on("userDisconnected", (currentId) => {
      // console.log("A user disconnected with id: ", currentId);
      if (
        chatPerson &&
        chatPerson.chatPersonInfo &&
        currentId === chatPerson.chatPersonInfo._id
      ) {
        setStatus("Offline");
      }
    });

    return () => {
      socket.off("message-sent");
      socket.off("message-received");
    };
  });

  const sendMessage = () => {
    if (
      chatPerson &&
      chatPerson.conversationId &&
      userInfo &&
      userInfo.userInfo
    ) {
      socket.emit(
        "new-message",
        message,
        chatPerson.conversationId,
        userInfo.userInfo._id
      );
    }
    setMessage("");
  };

  const typingTimeout = useRef(null);

  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", chatPerson.conversationId);
    }
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", chatPerson.conversationId);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.container2}>
          <div className={classes.leftContainer}>
            <div className={classes.heading1}>Messaging</div>
            <div className={classes.searchBar}>
              <SearchIcon sx={{ color: "gray", margin: "0 0 0 4px" }} />
              <input className={classes.searchInput} type="text" />
            </div>
            <div className={classes.chatsContainer}>
              {ids.length > 0 ? (
                ids.map((item, index) => (
                  <ChatPerson key={index} id={ids[index]} />
                ))
              ) : (
                <div>No conversation found</div>
              )}
            </div>
          </div>
          {!chatPerson.chatPersonInfo && (
            <h2
              style={{
                width: "70%",
                height: "100%",
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              Select a person to chat
            </h2>
          )}
          {chatPerson.chatPersonInfo && (
            <div className={classes.rightContainer}>
              <div className={classes.infoBar}>
                <img className={classes.image} src="" alt="" />
                <div className={classes.information}>
                  <div className={classes.name}>
                    {chatPerson && chatPerson.chatPersonInfo
                      ? chatPerson.chatPersonInfo.username
                      : ""}
                  </div>
                  <div className={classes.status}>
                    {typingStatus ? "typing..." : status}
                  </div>
                </div>
              </div>
              <div ref={chatContainerRef} className={classes.chatContainer}>
                {loading2 && <div>..loading</div>}
                {!loading2 && messages.length === 0 ? (
                  <div>No messages</div>
                ) : (
                  messages.map((message, index) => {
                    if (
                      userInfo &&
                      userInfo.userInfo &&
                      message.senderId === userInfo.userInfo._id
                    ) {
                      return (
                        <div key={index} className={classes.myMessage}>
                          <div className={classes.text}>{message.message}</div>
                          <div className={classes.time}>
                            {message.createdAt}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className={classes.notMyMessage}>
                        <div className={classes.text}>{message.message}</div>
                        <div className={classes.time}>{message.createdAt}</div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className={classes.textContainer}>
                <SentimentSatisfiedAltIcon
                  className={classes.icon}
                  sx={{ fontSize: "34px", margin: "0 8px" }}
                />
                <textarea
                  value={message}
                  onChange={typingHandler}
                  className={classes.textInputField}
                  type="text"
                />
                <SendIcon
                  className={classes.icon}
                  onClick={sendMessage}
                  sx={{ fontSize: "44px", margin: "0 16px" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
