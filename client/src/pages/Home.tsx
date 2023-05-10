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
                    <button onClick={logOut}>Logout</button>
                    <br />
                    <a href="/Profile">Profile</a>
                    <br />
                    <a href="/AddAnimal">Add Animal</a>
                    <br />
                    <a href='/Users'>Users</a>
                </div>
            )}
        </div>
    )
}

export default Home;