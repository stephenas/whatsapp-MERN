import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

function Chat() {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [avatar, setAvatar] = useState("");
  console.log("Room Id - ", roomId);

  /*useEffect(() => {
    setSeed(Math.floor(Math.random() * 2000));
  }, []);*/

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data()?.name);
          setAvatar(snapshot.data()?.avatar);
        });
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  const sendMessage = (event) => {
    event.preventDefault();
    console.log("You typed - ", input);
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    /*await axios.post("/messages/new", {
      name: "Steve",
      messages: input,
      timestamp: "now",
      received: false,
    });*/
    setInput("");
  };

  function timeConvert(timeStamp) {
    let minutes = Math.floor((Date.now() - timeStamp) / 60000);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4);
    let years = Math.floor(months / 12);

    if (years > 0) {
      if (years === 1) return "1 year ago";
      else return `${years} years ago`;
    }
    if (months > 0) {
      if (months === 1) return "1 month ago";
      else return `${months} months ago`;
    }
    if (weeks > 0) {
      if (weeks == 1) return "1 week ago";
      return `${weeks} weeks ago`;
    }
    if (days > 0) {
      return `${days} days ago`;
    }
    if (hours > 0) {
      return `${hours} hours ago`;
    }
    if (minutes > 0) {
      if (minutes == 1) return "1 min ago";
      else return `${minutes} mins ago`;
    } else return "now";
  }

  return !roomId ? (
    <div className="chat">
      <div className="chat__room">
        <h2>
          Add new chat or Click on name to continue to chat or message with
          group
        </h2>
      </div>
    </div>
  ) : (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={avatar} />
        <div className="chat__headerInfo">
          {!roomName && <h3>Test app</h3>}
          {roomName && <h3>{roomName}</h3>}
          <p>
            last seen{" "}
            {timeConvert(messages[messages.length - 1]?.timestamp?.toDate())}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__messages ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            {console.log(message.name + "-" + user.displayName)}
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleString()}
            </span>
          </p>
        ))}

        {/* <p className="chat__messages chat__receiver">
            <span className="chat__name">steve</span>
            here Messages
            <span className="chat__timestamp">{new Date().toUTCString()}</span>
          </p> */}
      </div>
      <div className="chat__footer">
        <IconButton>
          <EmojiEmotionsOutlinedIcon />
        </IconButton>

        <IconButton>
          <AttachFileOutlinedIcon />
        </IconButton>

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
        <IconButton onClick={sendMessage} type="submit" className="chat__send">
          <SendIcon />
        </IconButton>
        <IconButton className="chat__record">
          <MicOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
