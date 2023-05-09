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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;