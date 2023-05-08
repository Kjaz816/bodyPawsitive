import React, { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [reqRes, setReqRes] = useState("");

  const checkConn = () => {
    fetch("https://bodypositive.onrender.com/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  };

  const addUser = () => {

    const body = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      password: "password",
      permLevel: "user",
      email: "",
    };

    console.log(body)



    fetch("https://bodypositive.onrender.com/api/users/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => setReqRes(data))
      .catch((error) => console.error(error));
  };


  useEffect(() => {
    checkConn();
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={addUser}>Add User</button>
      <h1>{reqRes}</h1>
    </div>
  );
}

export default App;