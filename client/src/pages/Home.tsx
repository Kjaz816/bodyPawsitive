const Home = () => {

    let currentUser = "Not logged In";
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        currentUser = "Welcome, " + loggedInUser;
    }

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
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
                    <a href="/Profile">Profile</a>
                    <br />
                    <a href="/AddAnimal">Add Animal</a>
                    <br />
                    <a href='/Users'>All Users</a> 
                    <br />
                    <a href='/Chat'>Chat</a>
                    <br />
                    <button onClick={logOut}>Logout</button>
                </div>
            )}
        </div>
    )
}

export default Home;