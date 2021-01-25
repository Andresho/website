import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Button } from "./../../components/Button";
import "./AuthStyle.css";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [signUpConfirmationStatus, setSignUpConfirmationStatus] = useState("");

  const resetPassword = (e) => {
    e.preventDefault();
    setSignUpConfirmationStatus("loading");
    Auth.forgotPassword(email)
      .then(() => {
        setSignUpConfirmationStatus("success");
      })
      .catch((err) => {
        setSignUpConfirmationStatus(err.message.toString());
      });
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  //garner.app/confirm-email/kipster...

  let signUpConfirmationText;
  if (signUpConfirmationStatus === "") {
    signUpConfirmationText = <p></p>;
  } else if (signUpConfirmationStatus === "loading") {
    signUpConfirmationText = (
      <p style={{ color: "#009432" }}>Sending email..</p>
    );
  } else if (signUpConfirmationStatus === "success") {
    signUpConfirmationText = (
      <p style={{ color: "#009432" }}>Email Sent! check your inbox</p>
    );
  } else {
    signUpConfirmationText = (
      <p style={{ color: "#ED4C67" }}>{signUpConfirmationStatus}</p>
    );
  }

  return (
    <div className="auth-form-container">
      <form onSubmit={resetPassword}>
        <h3 className="form-label">Reset password</h3>
        <h3 className="form-text">Email</h3>
        <input
          className="contact-email-input"
          id="confirm-email"
          type="email"
          required
          onChange={(e) => onEmailChange(e)}
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
};

export default ResetPasswordForm;
