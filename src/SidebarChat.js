import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import db from "./firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";

function SidebarChat({ addNewChat, id, name }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1500));
  }, []);
  const avatarPhoto = `https://avatars.dicebear.com/api/human/${seed}.svg`;

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        avatar: avatarPhoto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const stringConcat = (lastMessage, n = 50) => {
    return lastMessage?.length > n
      ? lastMessage.substr(0, n - 1) + "..."
      : lastMessage;
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={avatarPhoto} />
        <div className="sidebarChat__info">
          <h3>{name}</h3>
          <p>{stringConcat(messages[0]?.message)}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
