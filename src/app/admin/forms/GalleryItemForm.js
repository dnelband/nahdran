import React, { useState, useEffect } from 'react';
import MyDropzone from '../../partials/DropZone';
import $ from 'jquery';

function GalleryItemForm(props) {
  const gi = props.galleryItem;
  const [title, setTitle] = useState(gi ? gi.title : '');
  const [caption, setCaption] = useState(gi ? gi.caption : '');
  const [filepath, setFilePath] = useState(gi ? gi.filepath : '');
  const [thumbnail, setThumbnail] = useState(gi ? gi.thumbnail : '');
  const [type, setType] = useState(gi ? gi.type : '');
  const [ord, setOrd] = useState(gi ? gi.ord : 0);
  console.log(ord);

  function onSubmitClick() {
    const newGalleryItem = {
      gallery_id: gi ? gi.gallery_id : props.galleryId,
      title,
      caption,
      type,
      filepath,
      thumbnail,
      ord: parseInt(ord),
    };
    console.log(newGalleryItem);
    let ajaxMethod = props.type === 'edit' ? 'PUT' : 'POST';
    console.log(ajaxMethod);
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
    });
  }

  function onSetFile(data) {
    console.log(data);
    setFilePath(data.path);
    setThumbnail(data.thumbnail);
    setType(data.type);
  }

  let galleryItemDisplay;
  if (filepath) {
    if (type === 'picture')
      galleryItemDisplay = <img width="100%" src={__dirname + filepath} />;
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

  return (
    <div className="ui segment">
      <h4 className="ui header">Gallery Item form</h4>
      <div className="ui grid">
        <div className="gallery-item-form eight wide column">
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="caption..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
          ></textarea>
        </div>
        <div className="form-field">
          <label>Order ( 0 = last )</label>
          <input
            min="0"
            value={ord}
            onChange={e => setOrd(e.target.value)}
            type="number"
          />
        </div>
        <div className="eight wide column">
          {galleryItemDisplay}
          <MyDropzone image={__dirname + filepath} onFinishUpload={onSetFile} />
        </div>
      </div>
      <button onClick={onSubmitClick}>{props.type} gallery item</button>
      {gi ? <button onClick={deleteGalleryItem}>delete {gi.type}</button> : ''}
    </div>
  );
}

export default GalleryItemForm;
