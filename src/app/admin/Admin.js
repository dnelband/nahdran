import React, { useEffect, useState } from 'react';
import Table from './tables/Table';
import Form from './forms/Form';
import $ from 'jquery';

import '../style/admin.css';

function Admin() {

  let adminPath = window.location.pathname.split('/admin/')[1];
  if (adminPath && adminPath.indexOf('/') > -1) adminPath = adminPath.split('/')[0];
  let adminSectionDisplay;
  switch (adminPath) {
    case 'pages':
      adminSectionDisplay = <Table type="pages" />;
      break;
    case 'news':
      adminSectionDisplay = <Table type="news" />;
      break;
    case 'messages':
      adminSectionDisplay = <Table type="messages" />;
      break;
    case 'crew':
      adminSectionDisplay = <Table type="crew" />;
      break;
    case 'create':
      adminSectionDisplay = <Form type="create" />;
      break;
    case 'edit':
      adminSectionDisplay = <Form type="edit" />;
      break;
    default:
      adminSectionDisplay = <Table type="pages" />;
      break;
  }

  return (
    <div className="page">
      <section className="ui container" id="admin">
        <h1>Admin</h1>
        <AdminHeaderUserMenu/>
        <div className="ui secondary pointing menu">
          <a
            className={'item ' + (adminPath === 'pages' ? 'active' : '')}
            href="/admin/pages"
          >
            Seiten
          </a>
          <a
            className={'item ' + (adminPath === 'news' ? 'active' : '')}
            href="/admin/news"
          >
            Aktuelles
          </a>
          <a
            className={'item ' + (adminPath === 'crew' ? 'active' : '')}
            href="/admin/crew"
          >
            Regie & Team
          </a>
          <a
            className={'item ' + (adminPath === 'messages' ? 'active' : '')}
            href="/admin/messages"
          >
            Nachrichten
          </a>
        </div>
        {adminSectionDisplay}
      </section>
    </div>
  );
}

function AdminHeaderUserMenu(){

  const initUser = {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "password": "202cb962ac59075b964b07152d234b70",
      "createdAt": "2021-05-16T13:08:40.000Z",
      "updatedAt": null
  }
  const [ user, setUser ] = useState(initUser);
  const [ showChangePasswordForm, setShowChangePasswordForm ] = useState(false);

  useEffect(() => {
    // getUser();
  },[])

  function getUser(){
    fetch('/db/user/')
    .then(res => res.text())
    .then(res => {
      console.log(JSON.parse(res));
      setUser(JSON.parse(res));
    });
  }

  function onLogoutClick(){
    fetch('/db/signout/')
    .then(res => res.text())
    .then(res => {
      window.location.href = "/";
    });
  }

  let changePasswordFormDisplay;
  if (showChangePasswordForm === true){
    changePasswordFormDisplay = (
      <React.Fragment>
        <ChnagePasswordForm user={user} />
        <div onClick={() => setShowChangePasswordForm(showChangePasswordForm === true ? false : true)} className="modal-overlay"></div>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div id="user-container">
        <span>
          Hallo {user !== null ? user.username : ""}!
        </span>
        <span>&#183;</span>
        <a onClick={() => setShowChangePasswordForm(showChangePasswordForm === true ? false : true)}>Passwort ändern</a>
        <span>&#183;</span>
        <a onClick={() => onLogoutClick()}>Ausloggen</a>
      </div>
      {changePasswordFormDisplay}
    </React.Fragment>
  )
}

function ChnagePasswordForm(props){
  console.log(props);
  const [ newPassword, setNewPassword ] = useState("");
  const [ newPasswordRepeat, setNewPasswordRepeat ] = useState("");
  const [ isMatch, setIsMatch ] = useState(false);
  
  console.log(isMatch, "isMatch");

  useEffect(() => {
    let newIsMatch = false;
    if (newPassword === newPasswordRepeat) newIsMatch = true;
    setIsMatch(newIsMatch);
  },[newPassword, newPasswordRepeat])

  function onUpdatePasswordClick(){
    const newUserData = {
        ...props.user,
        password:newPassword
    }
    console.log('on update password click');
    $.ajax({
      url:`/db/user/${props.user.id}`,
      method:'POST',
      data:newUserData
    }).done(function (res) {
      console.log(res);
    });
  }

  let passwordsErrorDisplay = ""
  if (!isMatch && newPassword !== "" && newPasswordRepeat !== "") {
    passwordsErrorDisplay = <p style={{color:"red"}}>Passwörter sind nicht gleich</p>
  } else passwordsErrorDisplay = ""

  return (
    <div className="modal-window ui form">
      <div className="modal-header">
        <h2>Passwort Ändern</h2>
      </div>
      <div className="modal-body">
        <div className="form-field">
          <label> Neue Passwort: </label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
        </div>
        <div className="form-field">
          <label> Passwort Wiederholen: </label>
          <input type="password" value={newPasswordRepeat} onChange={e => setNewPasswordRepeat(e.target.value)}/>
        </div>
        {passwordsErrorDisplay}
      </div>
      <div className="modal-footer">
        <a className="ui button icon">
          Abbrechen
        </a>
        <a style={{float:"right"}} className="ui primary button icon" onClick={() => onUpdatePasswordClick()}>
          Aktualisieren
        </a>
      </div>
    </div>
  )
}

export default Admin;
