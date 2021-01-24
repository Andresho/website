import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button } from "./../../components/Button";
import { withRouter } from "react-router-dom";
import "./AuthStyle.css";

class ConfirmEmailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmationCode: "",
      confirmationEmail: this.props.match.params.email || "",
    };
    this.confirmSignUp = this.confirmSignUp.bind(this);
  }

  confirmSignUp(e) {
    e.preventDefault();
    this.setState({ signUpConfirmationStatus: "loading" });
    const { confirmationEmail, confirmationCode } = this.state;
    Auth.confirmSignUp(confirmationEmail, confirmationCode)
      .then(() => {
        this.setState({ signUpConfirmationStatus: "success" });
        this.props.history.push("/sign-in");
      })
      .catch((err) => {
        this.setState({ signUpConfirmationStatus: err.message.toString() });
      });
  }

  onConfirmationCodeChange(event) {
    this.setState({ confirmationCode: event.target.value });
  }
  onConfirmationEmailChange(event) {
    this.setState({ confirmationEmail: event.target.value });
  }

  //garner.app/confirm-email/kipster...

  render() {
    let signUpConfirmationText;
    if (this.state.signUpConfirmationStatus === "") {
      signUpConfirmationText = <p></p>;
    } else if (this.state.signUpConfirmationStatus === "loading") {
      signUpConfirmationText = <p style={{ color: "#009432" }}>Verifying...</p>;
    } else if (this.state.signUpConfirmationStatus === "success") {
      signUpConfirmationText = (
        <p style={{ color: "#009432" }}>Email verified!</p>
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
        <form onSubmit={this.confirmSignUp}>
          <h3 class="form-label">Confirm email</h3>
          <h3 className="form-text">Email</h3>
          <input
            className="contact-email-input"
            id="confirm-email"
            type="email"
            defaultValue={this.props.match.params.email || ""}
            required
            onChange={this.onConfirmationEmailChange.bind(this)}
          />
          <h3 className="form-text">Confirmation Code</h3>
          <input
            className="contact-email-input"
            id="confirmationCode"
            type="text"
            required
            onChange={this.onConfirmationCodeChange.bind(this)}
          />
          <div className="form-center">
            {signUpConfirmationText}
            <Button Color="#f1f3f6" type="submit" buttonSize="btn--wide">
              Verify email!
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(ConfirmEmailForm);
