import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function MessagesTable(props) {
  const [messages, setMessages] = useState();

  useEffect(() => {
    fetch('/db/messages/')
      .then(res => res.text())
      .then(res => {
        setMessages(JSON.parse(res));
      });
  }, []);

  let tableRowsDisplay;
  if (messages) {
    tableRowsDisplay = messages.map((m, index) => (
      <MessagesTableItem message={m} key={index} />
    ));
  }

  return (
    <div>
      <div className="section-header ui secondary menu">
        <h1>Messages</h1>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Nachricht</th>
            <th>Gesendet am</th>
            <th>Read</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function MessagesTableItem(props) {
  const m = props.message;

  function onDeleteMessageClick() {
    $.ajax({
      url: '/db/messages/' + m.msg_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/messages/';
    });
  }

  return (
    <tr>
      <td>{m.name}</td>
      <td>{m.email}</td>
      <td>{m.msg}</td>
      <td>{m.created_at}</td>
      <td>{m.read ? m.read : 'no'} </td>
      <td>
        <a
          href={'/admin/edit/crew/' + m.crew_id}
          className="ui primary button icon"
        >
          <i className="pencil icon"></i>
        </a>
        <button onClick={onDeleteMessageClick} className="ui red button icon">
          <i className="remove icon"></i>
        </button>
      </td>
    </tr>
  );
}

export default MessagesTable;
