import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Modal from 'react-modal';
import '../../style/adminContact.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

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
        <h1>Nachricht</h1>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Nachricht</th>
            <th>Gesendet am</th>
            <th>Gelesen</th>
            <th>Entfernen</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function MessagesTableItem(props) {
  const m = props.message;
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [read, setRead] = useState(m.read === 'true' ? true : false);
  console.log(read);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onReadCheckboxClick() {
    const updatedMessage = {
      name: m.name,
      email: m.email,
      msg: m.msg,
      created_at: m.created_at,
      read: read === true ? false : true,
    };
    console.log(updatedMessage);

    $.ajax({
      url: '/db/messages/' + m.msg_id,
      method: 'PUT',
      data: updatedMessage,
    }).done(function (res) {
      // window.location.href = '/admin/messages/';
      setRead(updatedMessage.read);
    });
  }

  function onDeleteMessageClick() {
    $.ajax({
      url: '/db/messages/' + m.msg_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/messages/';
      closeModal();
    });
  }

  return (
    <tr className={'read' + (read === false ? ' unread' : '')}>
      <td>
        <span>{m.name}</span>
      </td>
      <td>
        <span>{m.email}</span>
      </td>
      <td>
        <span>{m.msg}</span>
      </td>
      <td>
        <span>{m.created_at}</span>
      </td>
      <td>
        <input
          type="checkbox"
          checked={read === true ? 'checked' : ''}
          onChange={onReadCheckboxClick}
        />
      </td>

      <td>
        <button onClick={openModal} className="ui red button icon">
          <i className="remove icon"></i>
        </button>

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="my-popup-modal">
            <a className="close-icon" onClick={closeModal}>
              <i className="icon close"></i>
            </a>
            Nachricht entfernen?
            <form>
              <button
                onClick={onDeleteMessageClick}
                className="ui red button icon"
              >
                Entfernen
              </button>
            </form>
          </div>
        </Modal>
      </td>
    </tr>
  );
}

export default MessagesTable;
