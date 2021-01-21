import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button } from "./../../components/Button";
import "./AuthStyle.css";

export default class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
    this.resetPassword = this.resetPassword.bind(this);
  }

  resetPassword(e) {
    e.preventDefault();
    this.setState({ signUpConfirmationStatus: "loading" });
    const { email } = this.state;
    Auth.forgotPassword(email)
      .then(() => {
        this.setState({ signUpConfirmationStatus: "success" });
      })
      .catch((err) => {
        this.setState({ signUpConfirmationStatus: err.message.toString() });
      });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  //garner.app/confirm-email/kipster...

  render() {
    let signUpConfirmationText;
    if (this.state.signUpConfirmationStatus === "") {
      signUpConfirmationText = <p></p>;
    } else if (this.state.signUpConfirmationStatus === "loading") {
      signUpConfirmationText = (
        <p style={{ color: "#009432" }}>Sending email..</p>
      );
    } else if (this.state.signUpConfirmationStatus === "success") {
      signUpConfirmationText = (
        <p style={{ color: "#009432" }}>Email Sent! check your inbox</p>
      );
    } else {
      signUpConfirmationText = (
        <p style={{ color: "#ED4C67" }}>
          {this.state.signUpConfirmationStatus}
        </p>
      );
    }

    return (
      <div className="auth-form-container">
        <form onSubmit={this.resetPassword}>
          <h3 class="form-label">Reset password</h3>
          <h3 className="form-text">Email</h3>
          <input
            className="contact-email-input"
            id="confirm-email"
            type="email"
            required
            onChange={this.onEmailChange.bind(this)}
          />
          <p>
            We will send you an email so we can reset your password if you cant
            remember it.
          </p>
          <div className="form-center">
            {signUpConfirmationText}
            <Button Color="#f1f3f6" type="submit" buttonSize="btn--wide">
              Request reset
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
