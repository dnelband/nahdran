import { Suspense, useEffect, useState } from 'react';
import $ from 'jquery';
import './../style/contact.css';

function ContactForm(props) {
  // query the db for messages, check in the db table what info we need to be able to create a msg, then create a state var, for all the different msg fields
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgError, setMsgError] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  //   make function for sumiting the form so it gets saved to the db, and showed in the admin panel

  function submitForm() {
    if (formValidation()) {
      // create an object for the message, with name email msg
      const newMessage = {
        name,
        email,
        msg,
      };

      $.ajax({
        url: '/db/messages/',
        method: 'POST',
        data: newMessage,
      }).done(function (res) {
        setMsgSent(true);
      });
    }

    // log the object to console, make sure it looks like what we need to get
  }

  function formValidation() {
    // validation for each field
    let isValidated = true;
    if (name.length < 3) {
      setNameError(true);
      isValidated = false;
    } else {
      setNameError(false);
    }

    const pattern =
      /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+.([a-zA-Z])+([a-zA-Z])+/;
    const isValid = pattern.test(email);
    if (!isValid) {
      setEmailError(true);
      isValidated = false;
    } else {
      setEmailError(false);
    }

    if (msg.length < 5) {
      setMsgError(true);
      isValidated = false;
    } else {
      setMsgError(false);
    }

    return isValidated;
  }

  let nameErrorDisplay;
  if (nameError === true) {
    nameErrorDisplay = (
      <p className="error">Muss mindestens 3 Zeichen erhalten.</p>
    );
  }
  let emailErrorDisplay;
  if (emailError === true) {
    emailErrorDisplay = (
      <p className="error">Gib bitte eine gültige E-mail Adresse ein.</p>
    );
  }
  let msgerrorDisplay;
  if (msgError === true) {
    msgerrorDisplay = (
      <p className="error">Muss mindestens 5 Zeichen erhalten.</p>
    );
  }

  let submitSuccess;
  if (msgSent === true) {
    submitSuccess = (
      <p className="success">Nachricht würde erfolgreich gesendet!</p>
    );
  }

  // display the form
  return (
    <div className="contact-form">
      <div className="name">
        <div>Name</div>
        <input
          className="name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        {nameErrorDisplay}
      </div>

      <div className="email">
        <div>Email</div>
        <input
          className="email-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        {emailErrorDisplay}
      </div>
      <div className="msg">
        <div>Dein Nachricht</div>
        <textarea
          id="textarea"
          className="inputarea"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          type="text"
          placeholder="Text"
        />
        {msgerrorDisplay}
      </div>

      <div className="submit">
        <a className="btn" onClick={submitForm}>
          Submit
        </a>
      </div>

      {submitSuccess}
    </div>
  );

  // test all fields
}

export default ContactForm;

// to connect the display of an input(text email, nameetc) a state var we need to do teo things
// #1 input must always show the value of the state var (value is the first element in the array the second element is the function to update)
// #2 onChane must always update the state var

// everytime we press a key like a letter or delete (a letter) it needs to be updated, we see that it does update by log to the console that a letter appears or dissapers in real time, use value and on change for making this happen

// state var for errors are true or false the default should be false as we wont have errors until we msubmit or write something, and we also want a warning or so to be shown if there is an error, if default is set to true that warning would always be there
