import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import GalleryItemForm from './GalleryItemForm';
import TextEditor from '../../partials/TextEditor';
import '../../style/adminGallery.css';

function GalleryForm(props) {
  const [gallery, setGallery] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [galleryItems, setGalleryItems] = useState();
  const [showAddGalleryItemForm, setShowAddGalleryItemForm] = useState(false);

  useEffect(() => {
    if (props.galleryId) getGallery();
  }, []);

  function getGallery() {
    fetch('/db/galleries/' + props.galleryId)
      .then(res => res.text())
      .then(res => {
        let g = JSON.parse(res)[0];
        setGallery(g);
        setTitle(g.title);
        setDescription(g.description);
        getGalleryItems(g);
      });
  }

  function getGalleryItems(g) {
    setShowAddGalleryItemForm(false);
    let gId = gallery ? gallery.gallery_id : g.gallery_id;
    fetch('/db/galleryitemsbygallery/' + gId)
      .then(res => res.text())
      .then(res => {
        setGalleryItems(JSON.parse(res));
      });
  }

  function onSubmitClick() {
    const newGallery = { title, description };
    let ajaxMethod = props.type === 'edit' ? 'PUT' : 'POST';
    $.ajax({
      url: '/db/galleries/' + (props.type === 'edit' ? gallery.gallery_id : ''),
      method: ajaxMethod,
      data: newGallery,
    }).done(function (res) {
      if (props.type === 'create') props.onCreateGallery(res.id);
      else window.location.href = '/admin/edit/page/' + props.pageId;
    });
  }

  let galleryDisplay;
  if (props.galleryId) {
    let galleryItemsDisplay;
    if (galleryItems) {
      galleryItemsDisplay = galleryItems.map((gi, index) => {
        return (
          <GalleryItemForm
            key={index}
            galleryItem={gi}
            onSubmit={getGalleryItems}
            galleryId={props.galleryId}
            type={'edit'}
          />
        );
      });
    }

    let addGalleryItemForm;
    if (showAddGalleryItemForm === true)
      addGalleryItemForm = (
        <GalleryItemForm
          onSubmit={getGalleryItems}
          galleryId={props.galleryId}
          type={'create'}
        />
      );

    galleryDisplay = (
      <div className="gallery-items-container">
        <a
          className="ui green button labeled icon upload-btn"
          onClick={() =>
            setShowAddGalleryItemForm(
              showAddGalleryItemForm === true ? false : true
            )
          }
        >
          <i className="plus icon"></i>
          Bild hinzuf??gen
        </a>

        {addGalleryItemForm}
        <div className="gallery-images">{galleryItemsDisplay}</div>
      </div>
    );
  }

  let textEditorDisplay;
  if (description)
    textEditorDisplay = (
      <TextEditor val={description} onTextEditorUpdate={setDescription} />
    );

  return (
    <div className="ui raised segment gallery-container">
      <h3>Text bearbeiten:</h3>
      <div className="header">
        {/* <input
          placeholder="Gallery Title..."
          type="text"
          onChange={e => setTitle(e.target.value)}
          value={title}
        /> */}
        {textEditorDisplay}
      </div>
      <a className="ui primary button update" onClick={onSubmitClick}>
        Aktualisieren
      </a>
      <hr />
      <h3>Bilder bearbeiten:</h3>
      {galleryDisplay}
    </div>
  );
}

// Hook use Previous
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export default GalleryForm;
