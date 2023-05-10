import { useEffect, useState } from "react";

interface UserBody {
    username: string;
    firstName: string;
    lastName: string;
    permLevel: string;
    email: string;
}

const Users = () => {

    const [users, setUsers] = useState<UserBody[]>([]);

    const getAllProfiles = () => {
        fetch(`/api/users/getAllProfiles`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => console.error(error));
    }


    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
            <a href="/">Back to Home</a>
            <p>Users</p>
            {users.map((user) => (
                <div key={user.username}>
                    <hr></hr>
                    <p>Username: {user.username}</p>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Role: {user.permLevel}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => { window.location.href = `/Users/${user.username}` }}>View Profile</button> 
                </div>
            ))}
        </div>

    )
}

export default Users;