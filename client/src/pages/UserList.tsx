import { useEffect, useState } from "react";
import { User } from "../models/userModel";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";

const UserList = () => {

    const currentUser = sessionStorage.getItem("loggedInUser");

    const [users, setUsers] = useState<User[]>([]);

    const getAllProfiles = () => {
        api.getAllProfiles()
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
            <TopNavigation/>
            
            <a href="/">Back to Home</a>
            <p>Users</p>
            {users.map((user) => (
                <div key={user.username}>
                    {user.username !== currentUser && (
                        <div>
                            <hr></hr>
                            <p>Username: {user.username}</p>
                            <p>First Name: {user.firstName}</p>
                            <p>Last Name: {user.lastName}</p>
                            <p>Role: {user.permLevel}</p>
                            <p>Email: {user.email}</p>
                            <button onClick={() => { window.location.href = `/Users/${user.username}` }}>View Profile</button>
                            <button onClick={() => { window.location.href = `/Chat/${user.username}` }}>Send a Message</button>
                        </div>
                    )}
                </div>
            ))}
        </div>

    )
}

export default UserList;