import React, { useState, useEffect } from 'react';
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

function NewsTable() {
  const [news, setNews] = useState();

  useEffect(() => {
    fetch('/db/news/')
      .then(res => res.text())
      .then(res => {
        setNews(JSON.parse(res));
      });
  }, []);

  let tableRowsDisplay;
  if (news) {
    tableRowsDisplay = news.map((p, index) => (
      <NewsTableItem newsItem={p} key={index} />
    ));
  }

  return (
    <div>
      <div className="section-header ui secondary menu">
        <h1>Aktuelles</h1>
        <div className="ui right menu secondary">
          <div>
            <a
              href="/admin/create/news"
              className="ui green button labeled icon"
            >
              <i className="plus icon"></i> Neue Artikle hinzufügen
            </a>
          </div>
        </div>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Text</th>
            <th>Geschrieben am</th>
            <th>Bearbeiten</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function NewsTableItem(props) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const ni = props.newsItem;

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

  function onDeleteNewsItemClick() {
    $.ajax({
      url: '/db/news/' + ni.news_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/news/';
      closeModal();
    });
  }

  return (
    <tr>
      <td>{ni.title}</td>
      <td>
        <div dangerouslySetInnerHTML={{ __html: ni.text }}></div>
      </td>
      <td>{ni.created_at}</td>
      <td>
        <a
          href={'/admin/edit/news/' + ni.news_id}
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
            Artikel entfernen?
            <form>
              <button
                onClick={onDeleteNewsItemClick}
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

export default NewsTable;
