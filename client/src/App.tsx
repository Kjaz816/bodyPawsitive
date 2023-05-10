import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import AddAnimal from "./pages/AddAnimal";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AnimalDetails from "./pages/AnimalDetails";
import EditAnimal from "./pages/EditAnimal";
import ViewWeight from "./pages/ViewWeight";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import UserAnimal from "./pages/UserAnimal";

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/EditProfile" element={<EditProfile />} /> 
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/AddAnimal" element={<AddAnimal />} />
          <Route path="/AnimalDetails/:id" element={<AnimalDetails />} />
          <Route path='/EditAnimal/:id' element={<EditAnimal />} />
          <Route path='/ViewWeight/:id' element={<ViewWeight />} />
          <Route path='/Users' element={<Users />} />
          <Route path='/Users/:username' element={<UserProfile />} />
          <Route path='/Users/:username/animals/:id' element={<UserAnimal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;