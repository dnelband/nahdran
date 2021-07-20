import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import Modal from 'react-modal';

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

function CrewTable() {
  const [crew, setCrew] = useState();

  useEffect(() => {
    fetch('/db/crew/')
      .then(res => res.text())
      .then(res => {
        setCrew(JSON.parse(res));
      });
  }, []);

  let tableRowsDisplay;
  if (crew) {
    tableRowsDisplay = crew.map((cm, index) => (
      <CrewTableItem crewMember={cm} key={index} />
    ));
  }

  return (
    <div>
      <div className="section-header ui secondary menu">
        <h1>Regie & Team</h1>
        <div className="ui right menu secondary">
          <div>
            <a
              href="/admin/create/crew"
              className="ui green button labeled icon"
            >
              <i className="plus icon"></i> Neue Person hinzufügen
            </a>
          </div>
        </div>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Bild</th>
            <th>Name</th>
            <th>Job</th>
            <th>Bearbeiten</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function CrewTableItem(props) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const c = props.crewMember;

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

  function onDeleteCrewMemberClick() {
    $.ajax({
      url: '/db/crew/' + c.crew_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/crew/';
      closeModal();
    });
  }

  return (
    <tr>
      <td>
        <img width="50" src={__dirname + c.picture} />
      </td>
      <td>{c.name}</td>
      <td>{c.job}</td>
      <td>
        <a
          href={'/admin/edit/crew/' + c.crew_id}
          className="ui primary button icon"
        >
          <i className="pencil icon"></i>
        </a>
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
            {c.name} entfernen?
            <form>
              <button
                onClick={onDeleteCrewMemberClick}
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

export default CrewTable;
