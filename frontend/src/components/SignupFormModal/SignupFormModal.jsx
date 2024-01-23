import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    console.log("handling that submission for ya");

    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log(
            "whoa there bud, looks like there are some errors with your log in"
          );
          console.log(data);
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && (
          <p className="error-message">{"The provided email is invalid"}</p>
        )}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="error-message">{errors.username}</p>}
        {username.length < 4 && (
          <p className="error-message">
            {"Your username must be at least 4 characters."}
          </p>
        )}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && (
          <p className="error-message">{errors.firstName}</p>
        )}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-message">{errors.password}</p>}
        {password.length < 4 && (
          <p className="error-message">
            {"Your password must be at least 6 characters."}
          </p>
        )}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        {confirmPassword !== password && (
          <p className="error-message">
            It looks like your passwords do not match, please check again.
          </p>
        )}
        <button
          type="submit"
          disabled={
            password.length < 6 ||
            username.length < 4 ||
            email.length < 3 ||
            confirmPassword.length < 6 ||
            lastName.length < 1 ||
            firstName < 1 ||
            confirmPassword !== password
          }
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
