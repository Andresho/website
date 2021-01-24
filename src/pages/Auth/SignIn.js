import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button } from "./../../components/Button";
import { Link, withRouter } from "react-router-dom";
import "./AuthStyle.css";

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      email: "",
      signInStatus: "",
    };
    this.signIn = this.signIn.bind(this);
  }

  signIn(e) {
    e.preventDefault();
    this.setState({ signInStatus: "loading" });
    const { password, email } = this.state;
    Auth.signIn({
      username: email,
      password: password,
    })
      .then(() => {
        this.setState({ signInStatus: "success" });
        this.props.checkAuth();
        this.props.history.push("/get-started");
      })
      .catch((err) => {
        this.setState({ signInStatus: err.message.toString() });
      });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    let signUpText;
    if (this.state.signInStatus === "") {
      signUpText = <p></p>;
    } else if (this.state.signInStatus === "loading") {
      signUpText = <p style={{ color: "#009432" }}>Signing in...</p>;
    } else if (this.state.signInStatus === "success") {
      signUpText = <p style={{ color: "#009432" }}>Signed in!</p>;
    } else {
      signUpText = (
        <p style={{ color: "#ED4C67" }}>{this.state.signInStatus}</p>
      );
    }

    return (
      <div className="auth-form-container">
        <form onSubmit={this.signIn}>
          <h3 className="form-label">Sign in</h3>
          <h3 className="form-text">Email</h3>
          <input
            className="contact-email-input"
            id="email"
            type="email"
            required
            onChange={this.onEmailChange.bind(this)}
          />
          <h3 className="form-text">
            password
            <span className="form-span">minimun length of 8 characters</span>
          </h3>
          <input
            className="contact-email-input"
            id="password"
            type="password"
            minLength="8"
            required
            onChange={this.onPasswordChange.bind(this)}
          />
          <p>
            Forgotten your password?
            <Link to="/reset-password" className="form-link-small">
              Reset it here.
            </Link>
          </p>
          <div className="form-bottom-content">
            <Button Color="#f1f3f6" type="submit" buttonSize="btn--form">
              Sign in!
            </Button>
          </div>
          <div className="form-bottom-content inset">
            <p>
              Dont have an account yet?
              <Link to="/sign-up" className="form-link-small">
                Sign up here
              </Link>
            </p>
            {signUpText}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SignUpForm);
