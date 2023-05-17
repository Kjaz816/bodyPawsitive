import { TextField } from '@mui/material';
import * as api from "../apiControllers/userController";
import { useEffect, useState } from "react";
import "../styling/TopNavigation.css" 
import TopTitle from "../lib/icons/TitleLogo.svg"
import NavigationBar from "../lib/icons/NavigationBar.svg"

import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
  } from "@material-ui/core";
  import {
    CheckBoxOutlineBlankOutlined,
    DraftsOutlined,
    HomeOutlined,
    InboxOutlined,
    MailOutline,
    ReceiptOutlined,
  } from "@material-ui/icons";
  
const data = [
    {
      name: "Home",
      icon: <HomeOutlined />,
    },
    { name: "Inbox", icon: <InboxOutlined /> },
    { name: "Outbox", icon: <CheckBoxOutlineBlankOutlined /> },
    { name: "Sent mail", icon: <MailOutline /> },
    { name: "Draft", icon: <DraftsOutlined /> },
    { name: "Trash", icon: <ReceiptOutlined /> },
  ];
  
const TopNavigation = () => {

    
    interface SignUpBody {
        username: string;
        firstName: string;
        lastName: string;
        permLevel: string;
        email: string;
        photo: string;
        animals: {
            _id: string;
            name: string;
            species: string;
            breed: string;
            weightData: {
                weight: number;
                date: Date;
            }[];
            age: number;
            photo: string;
            details: string;
        }[];
    }
        
        const [profileDetails, setProfileDetails] = useState<SignUpBody>({
            username: "",
            firstName: "",
            lastName: "",
            permLevel: "",
            email: "",
            photo: "",
            animals: [
                {
                    _id: "",
                    name: "",
                    species: "",
                    breed: "",
                    weightData: [
                        {
                            weight: 0,
                            date: new Date()
                        }
    
                    ],
                    age: 0,
                    photo: "",
                    details: ""
                }
            ],
        });
        
    
        const getProfile = () => {
            const username = sessionStorage.getItem("loggedInUser");
            if (username) {
                api.getProfile(username)
                    .then((data) => {
                        setProfileDetails(data);
                    }
                    )
                    .catch((error) => console.error(error));
            } else {
                window.location.href = "/Login";
            }
        };
    
    
        useEffect(() => {
            getProfile();
        }, []);
    
    
    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }

    const [open, setOpen] = useState(false);


  const getList = () => (
    <div style={{ width: 250 }} onClick={() => setOpen(false)}>
      {data.map((item, index) => (
        <ListItem button key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

    return (  

        <div className="top-navigation-container"> 
        
            <div>
                <Button onClick={() => setOpen(true)} className="navigation-bar">
                    <img src={NavigationBar} className="navigation-bar-img"></img>
                </Button>
                <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
                    {getList()}
                </Drawer>
            </div>

            <button onClick={logOut} className="profile-bar">
                <img src={profileDetails.photo} className="profile-picture-img"></img>
                <p className="profile-name">{profileDetails.firstName} {profileDetails.lastName}</p>
            </button>

            <img src={TopTitle} className="top-title"></img>

            <button onClick={logOut} className="chat">Chat</button>
            <button onClick={logOut} className="logout">Logout</button>
        </div>

    );
}

export default TopNavigation;
