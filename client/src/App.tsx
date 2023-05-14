import React from "react";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import AddAnimal from "./pages/AddAnimal";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AnimalDetails from "./pages/AnimalDetails";
import EditAnimal from "./pages/EditAnimal";
import ViewAnimalWeight from "./pages/ViewAnimalWeight";
import UserList from "./pages/UserList";
import OtherUserProfile from "./pages/OtherUserProfile";
import OtherUserAnimalDetails from "./pages/OtherUserAnimalDetails";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/EditProfile/:id" element={<EditProfile />} /> 
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/AddAnimal" element={<AddAnimal />} />
          <Route path="/AnimalDetails/:id" element={<AnimalDetails />} />
          <Route path='/EditAnimal/:id' element={<EditAnimal />} />
          <Route path='/ViewWeight/:id' element={<ViewAnimalWeight />} />
          <Route path='/Users' element={<UserList />} />
          <Route path='/Users/:username' element={<OtherUserProfile />} />
          <Route path='/Users/:username/animals/:id' element={<OtherUserAnimalDetails />} />
          <Route path='/Chat' element={<ChatList />} />
          <Route path='/Chat/:username' element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;