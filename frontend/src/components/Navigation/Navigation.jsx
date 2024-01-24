import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <h1>
        <NavLink exact to="/">
          <img
            id="home-button"
            src="https://i.imgur.com/jRjQ42d.png"
            alt="Home Button"
            height="50"
            width="225"
          />
        </NavLink>
      </h1>
      <div className="user-nav">
        {sessionUser && (
          <div id="spot-management">
            <p className="nav-button" id="new-spot-button">
              <NavLink exact to="/spots/new" style={{ textDecoration: "none" }}>
                Create a New Spot
              </NavLink>
            </p>
          </div>
        )}
        <div className="profile-button">
          <ul>
            {isLoaded && (
              <li className="remove-bullet">
                <ProfileButton user={sessionUser} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
