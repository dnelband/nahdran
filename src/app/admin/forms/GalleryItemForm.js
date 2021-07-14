import React, { useState, useEffect } from 'react';
import MyDropzone from '../../partials/DropZone';
import $ from 'jquery';
import '../../style/adminGallery.css';
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

function GalleryItemForm(props) {
  const gi = props.galleryItem;
  const [filepath, setFilePath] = useState(gi ? gi.filepath : '');
  const [thumbnail, setThumbnail] = useState(gi ? gi.thumbnail : '');
  const [type, setType] = useState(gi ? gi.type : '');
  const [ord, setOrd] = useState(gi ? gi.ord : 0);
  const [showUploader, setShowUploader] = useState(
    props.type === 'create' ? true : false
  );

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

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

  function onSubmitClick() {
    const newGalleryItem = {
      gallery_id: gi ? gi.gallery_id : props.galleryId,
      type,
      filepath,
      thumbnail,
      ord: parseInt(ord),
    };
    let ajaxMethod = props.type === 'edit' ? 'PUT' : 'POST';

    $.ajax({
      url:
        '/db/galleryitems/' + (props.type === 'edit' ? gi.gallery_item_id : ''),
      method: ajaxMethod,
      data: newGalleryItem,
    }).done(function (res) {
      props.onSubmit();
    });
  }

  function deleteGalleryItem() {
    $.ajax({
      url: '/db/galleryitems/' + gi.gallery_item_id,
      method: 'DELETE',
    }).done(function (res) {
      props.onSubmit();
      closeModal();
    });
  }

  function onSetFile(data) {
    setFilePath(data.path);
    setThumbnail(data.thumbnail);
    setType(data.type);
    setShowUploader(false);
  }

  let galleryItemDisplay;
  if (filepath) {
    if (type === 'picture')
      galleryItemDisplay = (
        <img width="100%" src={__dirname + filepath} onClick={openModal} />
      );
    else if (type === 'video') {
      galleryItemDisplay = (
        <video src={__dirname + filepath} width="320" height="240" controls>
          <source
            src={__dirname + filepath}
            type={
              'video/' + filepath.split('.')[filepath.split('.').length - 1]
            }
          ></source>
        </video>
      );
    }
  }

  let uploaderDisplay;
  if (showUploader === true) {
    uploaderDisplay = (
      <MyDropzone image={__dirname + filepath} onFinishUpload={onSetFile} />
    );
  } else {
    uploaderDisplay = (
      <div className="gallery-item-display">{galleryItemDisplay}</div>
    );
  }

  return (
    <div
      className="gallery-content"
      style={{ backgroundColor: props.type === 'create' ? 'lightgray' : '' }}
    >
      <div className="gallery-items"> {uploaderDisplay}</div>
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
          {galleryItemDisplay}
          <form>
            {gi ? (
              <a className="ui red button delete" onClick={deleteGalleryItem}>
                Bild entfernen
              </a>
            ) : (
              ''
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
}

{
  /* <label>Reihenfolge:1</label> */
}
{
  /* <input
            min="0"
            value={ord}
            onChange={e => setOrd(e.target.value)}
            type="number"
          /> */
}
{
  /* <button onClick={onSubmitClick}>{props.type} gallery item</button> */
}
{
  /* {gi ? <button onClick={deleteGalleryItem}>delete {gi.type}</button> : ''} */
}

export default GalleryItemForm;
