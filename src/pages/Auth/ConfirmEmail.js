import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Button } from "./../../components/Button";
import { withRouter } from "react-router-dom";
import "./AuthStyle.css";

const ConfirmEmailForm = ({ history, match }) => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [signUpConfirmationStatus, setSignUpConfirmationStatus] = useState("");

  const confirmSignUp = (e) => {
    e.preventDefault();
    setSignUpConfirmationStatus("loading");
    Auth.confirmSignUp(confirmationEmail, confirmationCode)
      .then(() => {
        setSignUpConfirmationStatus("success");
        history.push("/sign-in");
      })
      .catch((err) => {
        setSignUpConfirmationStatus(err.message.toString());
      });
  };

  const onConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };
  const onConfirmationEmailChange = (e) => {
    setConfirmationEmail(e.target.value);
  };

  //garner.app/confirm-email/kipster...

  let signUpConfirmationText;
  if (signUpConfirmationStatus === "") {
    signUpConfirmationText = <p></p>;
  } else if (signUpConfirmationStatus === "loading") {
    signUpConfirmationText = <p style={{ color: "#009432" }}>Verifying...</p>;
  } else if (signUpConfirmationStatus === "success") {
    signUpConfirmationText = (
      <p style={{ color: "#009432" }}>Email verified!</p>
    );
  } else {
    signUpConfirmationText = (
      <p style={{ color: "#ED4C67" }}>{signUpConfirmationStatus}</p>
    );
  }

  return (
    <div className="auth-form-container">
      <form onSubmit={confirmSignUp}>
        <h3 className="form-label">Confirm email</h3>
        <h3 className="form-text">Email</h3>
        <input
          className="contact-email-input"
          id="confirm-email"
          type="email"
          defaultValue={match.params.email || ""}
          required
          onChange={(e) => onConfirmationEmailChange(e)}
        />
        <h3 className="form-text">Confirmation Code</h3>
        <input
          className="contact-email-input"
          id="confirmationCode"
          type="text"
          required
          onChange={(e) => onConfirmationCodeChange(e)}
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
};

export default withRouter(ConfirmEmailForm);
