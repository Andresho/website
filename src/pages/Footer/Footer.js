import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import {
  //FaFacebook,
  //FaInstagram,
  //FaYoutube,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { MdFingerprint } from "react-icons/md";

function Footer() {
  return (
    <div className="footer-container">
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              <MdFingerprint className="navbar-icon" />
              Garner
            </Link>
          </div>
          <small className="website-rights">Garner © 2020</small>
          <div className="social-icons">
            <Link
              className="social-icon-link"
              to="//github.com/kipgparker/Garner"
              target="_blank"
              aria-label="Twitter"
              rel="noreferrer"
            >
              <FaGithub />
            </Link>
            <Link
              className="social-icon-link"
              to={"//www.linkedin.com/in/kip-parker-773b00182/"}
              target="_blank"
              aria-label="LinkedIn"
              rel="noreferrer"
            >
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
