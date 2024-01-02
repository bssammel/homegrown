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
            src="https://lh3.googleusercontent.com/pw/ABLVV85bXwPUCSwagRlBq4ZTjUPrNAgpphIZN42_c-KIunStoZ84IPhVvZC7GZ07mSJpOAh2iHo4LOC4GzzSbMgt7genwPrdH5sBtl-s3dlEhorqGCPCVlmW1_sMgzpLLauRacCXmLJu5oVcos8PE7k6r51qXRyGhJOLcjFQQU4g-C9k74E7B3pmLiHJ3VVW05G2SVQVLjQ7mzUJndZrtEs95J3IzmNahiQNL8NryrcwrRrrtHqtVyzMLvdkroHmant51XW1-nefkka4f3EMi2a0V_MNgZDHrUzQBSx0xFJdfi3i9aoT9V4YaX3vlrT2lkYQORYVd9dcC20Pnd7XVxga1y_wcuuJZa5ovKYIvgRxHwxV3cddh1BhIU3OKim6VQawZWxbw8i2RFn3Q1wwMDFCzbLlGxoZfH8HgFfQekyrx0wdshRcAIZte_ZF5lBMawDkDPz9zL9_RrdUGGvfdTeR2dnfpJo8_gQUfZJxcrG6O4LN8X-nJTcGdSh-Ynq39NUuLDO56knqEEqtiSLq-mPqGhLgE1PGrtJdS3nBkuJEOXhStTkC1RUfeSecZXlHHq6ZV8Sy_m98J0ehl0AxJKXiBTa0-AF8CDAlAC336yUyCGvh2XHt3atYZCAoSHPkYysySCyS9ExBstttPotdlsbFp1CyQ7ycXxm2xoUr4TUByz1hHVphMeFGr2I6YVjmllPGTZzEX_K9wQypDb8TtWntzMhu7KunPktiaemapyt0hbq7v0jiMAKGEbh4_G9BDJrrKaPZR87JcUYfONFZSkhqu_XVKBkEyX--dk8eDrgZRIzqApb9ER0Di0Tl6nYHVCbT9-9bkQIJcaAO9p7Kt6eG0yEo2jSnZwdZH-06ucpPEsRvX7kXhSZ2nmZYb8MR5oW3iA=w800-h175-s-no-gm?authuser=0"
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
