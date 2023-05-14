const Home = () => {

    let currentUser = "Not logged In";
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loggedInUserPermLevel = sessionStorage.getItem('loggedInUserPermLevel');
    if (loggedInUser) {
        currentUser = "Welcome, " + loggedInUser;
        console.log(loggedInUserPermLevel)
    }

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }

    return (
        <div>
            <p>Home</p>
            <p> {currentUser} </p>
            {!loggedInUser && (
                <div>
                    <a href="/SignIn">Sign In</a>
                    <br />
                    <a href="/SignUp">Sign Up</a>
                </div>
            )}

            {loggedInUser && (
                <div>
                    <div>
                        <a href="/Profile">Profile</a>
                        <br />
                        <a href='/Users'>All Users</a>
                        <br />
                        <a href='/Chat'>Chat</a>
                        <br />
                        <button onClick={logOut}>Logout</button>
                    </div>
                    
                    {loggedInUserPermLevel === "admin" || loggedInUserPermLevel === "vet" && (
                        <div>
                            <a href="/AddAnimal">Add Animal</a>
                        </div>)}
                </div>
            )}
        </div>
    )
}

export default Home;