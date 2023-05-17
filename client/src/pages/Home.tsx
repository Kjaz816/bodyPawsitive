import TopNavigation from "../components/TopNavigation";
import "../styling/Home.css";
import SpcaGlobe from "../lib/assets/SpcaGlobe.svg"

const Home = () => {

    let currentUser = "Not logged In";
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loggedInUserPermLevel = sessionStorage.getItem('loggedInUserPermLevel');
    if (loggedInUser) {
        console.log(loggedInUserPermLevel)
    }

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }

    return (
        <div className="page-container-home">

            {!loggedInUser && (

                <div className = "home-initial-container">
                    <div className = "home-contents-container">
                        <h1 className = "home-title">Body Pawsitive</h1>
                        <p>A scale interfacing tool that allows you to track,<br />
                            weigh, and log details about your pet.</p>
                        <div className = "log-in-navigation-container">
                            <a href="/SignIn"><button>Log In</button></a>
                            <br />
                            <a href="/SignUp"><button>Sign Up</button></a>
                        </div>
                    </div>
                    <div className = "home-logo-image-container">
                        <img className = "home-logo-image" src={SpcaGlobe} alt="logo" />
                    </div>
                </div>

            )}

            {loggedInUser && (
                <div className = "home-page-container">
                    <TopNavigation/>
                    <p>Home</p>
                    <p> Hi, {loggedInUser} </p>
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