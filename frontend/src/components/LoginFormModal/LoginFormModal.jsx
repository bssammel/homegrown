import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal.jsx";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const { closeModal, setErrors, errors } = useModal();

  const handleSubmit = (e) => {
    console.log("handling that submission for ya");
    e.preventDefault();
    setErrors({});

    return (
      dispatch(sessionActions.login({ credential, password }))
        // .then(console.log(errors))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.message) {
            console.log(
              " whoa there bud, looks like there are some errors with your log in"
            );
            // console.log(data.message);
            setErrors(data.message);
            // console.log(errors);
          }
        })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <label>
          {/* Username or Email */}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </label>
        {/* {errors. && <p>The provided credentials were invalid.</p>} */}
        <label>
          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors && (
          <p className="error-message">
            The provided credentials were invalid.
          </p>
        )}
        <button
          type="submit"
          disabled={password.length < 6 || credential.length < 4}
        >
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
