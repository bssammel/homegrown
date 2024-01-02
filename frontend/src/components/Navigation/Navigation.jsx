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
      <ul>
        {sessionUser && (
          <>
            <li className="nav-button" id="new-spot-button">
              <NavLink exact to="/spots/new">
                Create a New Spot
              </NavLink>
            </li>
            <li className="nav-button" id="manage-spots-button">
              <NavLink exact to="/spots/current">
                Manage Spots
              </NavLink>
            </li>
          </>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
