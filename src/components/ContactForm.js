import React, { useState } from "react";
import { Button } from "./Button";
import "./ContactForm.css";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submitEmail = (e) => {
    e.preventDefault();
    setStatus("sending");
    fetch(
      "https://1b2u76kybi.execute-api.eu-west-2.amazonaws.com/production/email/send",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.MessageId !== undefined) {
          setStatus("success");
          resetForm();
        } else {
          setStatus("fail");
        }
      })
      .catch((error) => {
        console.error(error);
        setStatus("fail");
      });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  let resultText;
  if (status === "success") {
    resultText = (
      <p style={{ color: "#009432" }}>
        Message sent! Thanks for getting in contact
      </p>
    );
  } else if (status === "fail") {
    resultText = <p style={{ color: "#ED4C67" }}>Message failed to send.</p>;
  } else if (status === "sending") {
    resultText = <p style={{ color: "#009432" }}>Message sending.</p>;
  } else {
    resultText = <p></p>;
  }

  return (
    <div className="contact-form-container">
      <form className="contact-form" onSubmit={submitEmail} method="POST">
        <h1 className="contact-form-title">
          If you think we can help you the data you need for your next project,
          don't hesitate to get in touch.
        </h1>
        <ul className="form__items">
          <div className="contact-input-item">
            <h3 className="form-text">Name</h3>
            <input
              className="contact-email-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="contact-input-item">
            <h3 className="form-text">Email</h3>
            <input
              className="contact-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </ul>
        <ul className="form__items">
          <div className="contact-input-item">
            <h3 className="form-text">Subject</h3>
            <input
              className="contact-email-input"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </ul>
        <ul className="form__items">
          <div className="contact-input-item">
            <h3 className="form-text">Message</h3>
            <textarea
              className="contact-email-input tall-input"
              rows="6"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </ul>

        <div className="form-center">
          {resultText}
          <Button Color="#f1f3f6" type="submit" buttonSize="btn--wide">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
//Message sent! Thanks for getting in contact
