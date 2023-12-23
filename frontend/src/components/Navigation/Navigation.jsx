import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li className="nav-button" id="home-button">
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {sessionUser && (
        <li className="nav-button" id="new-spot-button">
          <NavLink exact to="/spots/new">
            Create a New Spot
          </NavLink>
        </li>
      )}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
