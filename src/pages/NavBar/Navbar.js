import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";

import { MdFingerprint } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { Auth } from "aws-amplify";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  checkAuth,
  admin,
  gatherer,
}) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const history = useHistory();

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  const signOut = () => {
    Auth.signOut()
      .then(() => {
        setIsAuthenticated(false);
        checkAuth();
        history.replace("/");
      })
      .catch((err) => console.log(err));
  };

  window.addEventListener("resize", showButton);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="navbar">
          <div className="navbar-container container">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              <MdFingerprint className="navbar-icon" />
              Garner
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  {gatherer && (
                    <li className="nav-btn">
                      {button ? (
                        <Link to="/manage-pools" className="btn-link">
                          <Button
                            buttonStyle="btn--primary"
                            Font="white"
                            Glow="orange"
                          >
                            View Experiments
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/manage-pools" className="btn-link">
                          <Button
                            Font="white"
                            Glow="orange"
                            buttonSize="btn--mobile"
                            onClick={closeMobileMenu}
                          >
                            Manage Experiments
                          </Button>
                        </Link>
                      )}
                    </li>
                  )}
                  {admin && (
                    <li className="nav-btn">
                      {button ? (
                        <Link to="/admin" className="btn-link">
                          <Button
                            buttonStyle="btn--outline"
                            Color="#2d3436"
                            Font="white"
                          >
                            Admin
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/admin" className="btn-link">
                          <Button
                            Color="#2d3436"
                            Font="white"
                            buttonSize="btn--mobile"
                            onClick={closeMobileMenu}
                          >
                            Admin
                          </Button>
                        </Link>
                      )}
                    </li>
                  )}
                  {!admin && !gatherer && (
                    <li className="nav-btn">
                      {button ? (
                        <Link to="/get-started" className="btn-link">
                          <Button buttonStyle="btn--outline">
                            Get Started!
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/get-started" className="btn-link">
                          <Button
                            buttonStyle="btn--outline"
                            buttonSize="btn--mobile"
                            onClick={closeMobileMenu}
                          >
                            Get Started!
                          </Button>
                        </Link>
                      )}
                    </li>
                  )}
                  <li className="nav-btn">
                    {button ? (
                      <Button
                        buttonStyle="btn--primary"
                        Color="#2d3436"
                        Font="white"
                        onClick={signOut}
                      >
                        Log out
                      </Button>
                    ) : (
                      <Button
                        buttonStyle="btn--primary"
                        Color="#2d3436"
                        Font="white"
                        buttonSize="btn--mobile"
                        onClick={signOut}
                      >
                        Log out
                      </Button>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-btn">
                    {button ? (
                      <Link to="/sign-up" className="btn-link">
                        <Button
                          buttonStyle="btn--primary"
                          Color="#2d3436"
                          Font="white"
                        >
                          Sign up
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/sign-up" className="btn-link">
                        <Button
                          buttonSize="btn--mobile"
                          Font="white"
                          Color="#2d3436"
                          onClick={closeMobileMenu}
                        >
                          Sign up
                        </Button>
                      </Link>
                    )}
                  </li>
                  <li className="nav-btn">
                    {button ? (
                      <Link to="/early-access" className="btn-link">
                        <Button buttonStyle="btn--primary" Glow="orange">
                          Get early access
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/early-access" className="btn-link">
                        <Button
                          buttonSize="btn--mobile"
                          Font="white"
                          Glow="orange"
                          onClick={closeMobileMenu}
                        >
                          Get early access
                        </Button>
                      </Link>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
