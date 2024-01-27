import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    console.log("toggleMenu is running");
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
    console.log(showMenu);
  };

  useEffect(() => {
    console.log(
      "useEffect running where show menu state is either false or true"
    );
    console.log(showMenu);
    if (!showMenu) return;
    console.log("useEffect still running where show menu state is only true");
    const closeMenu = (e) => {
      console.log("close menu running");
      if (!ulRef.current.contains(e.target)) {
        console.log("close menu setting false");
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    // return () => document.removeEventListener("click");
  }, []);

  // const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(setShowMenu(false))
      .then(navigate(`/`));
    setShowMenu(false);
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  console.log("Current show menu state: " + showMenu);

  return (
    <>
      <button onClick={toggleMenu} id="user-dropdown-button">
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <ul
          className={
            "profile-dropdown remove-bullet" + (showMenu ? "" : " hidden")
          }
          ref={ulRef}
        >
          {user ? (
            <>
              <li>Hello {user.firstName}</li>
              <li>{user.email}</li>
              <li className="nav-button" id="manage-spots-button">
                <NavLink
                  exact
                  to="/spots/current"
                  style={{ textDecoration: "none" }}
                >
                  Manage Spots
                </NavLink>
              </li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <li className="remove-bullet">
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={toggleMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li className="remove-bullet">
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={toggleMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
