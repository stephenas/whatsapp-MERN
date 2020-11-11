import React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src="https://static.wixstatic.com/media/56d0b8_c17642ca06994bd3b4fe4b1c90adf644~mv2_d_3008_4011_s_4_2.jpeg/v1/crop/x_0,y_1043,w_2975,h_2968/fill/w_69,h_69,al_c,q_80,usm_0.66_1.00_0.01/56d0b8_c17642ca06994bd3b4fe4b1c90adf644~mv2_d_3008_4011_s_4_2.webp" />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
