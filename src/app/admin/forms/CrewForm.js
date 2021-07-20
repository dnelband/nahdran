import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import MyDropzone from '../../partials/DropZone';

function CrewForm(props) {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [type, setType] = useState('');
  const [picture, setPicture] = useState('');
  const [about, setAbout] = useState('');
  const [ord, setOrd] = useState(0);
  const [showUploader, setShowUploader] = useState(false);
  const previousPicture = usePrevious(picture);

  useState(() => {
    if (props.itemId) {
      fetch('/db/crew/' + props.itemId)
        .then(res => res.text())
        .then(res => {
          setName(JSON.parse(res)[0].name);
          setJob(JSON.parse(res)[0].job);
          setType(JSON.parse(res)[0].type);
          setPicture(JSON.parse(res)[0].picture);
          setAbout(JSON.parse(res)[0].about);
          setOrd(JSON.parse(res)[0].ord);
        });
    }
  }, []);

  useEffect(() => {
    if (props.type === 'edit') {
      if (picture && previousPicture && picture !== previousPicture) {
        onSubmitClick();
      }
    }
  }, [picture]);

  function onSubmitClick() {
    const newCrewMember = {
      name,
      job,
      type,
      picture,
      about,
      ord: parseInt(ord),
    };

    let ajaxMethod = 'POST';
    if (props.type === 'edit') ajaxMethod = 'PUT';

    $.ajax({
      url: '/db/crew/' + (props.type === 'edit' ? props.itemId : ''),
      method: ajaxMethod,
      data: newCrewMember,
    }).done(function (res) {
      window.location.href =
        props.type === 'edit'
          ? '/admin/edit/crew/' + parseInt(props.itemId)
          : '/admin/crew/';
    });
  }

  function onSetPicture(data) {
    setPicture(data.path);
  }

  let uploaderDisplay;
  if (showUploader === true) {
    uploaderDisplay = (
      <MyDropzone image={picture} onFinishUpload={onSetPicture} />
    );
  } else {
    uploaderDisplay = <img width="100" src={__dirname + picture} />;
  }

  let uploaderButtonDisplay;
  if (showUploader === false) {
    uploaderButtonDisplay = (
      <a onClick={() => setShowUploader(showUploader === true ? false : true)}>
        <i className="redo icon"></i>
        {props.type === 'edit' ? 'Bild aktualisieren' : 'Bild hochladen'}
      </a>
    );
  }

  return (
    <div className="crew-form">
      <div className="ui grid">
        <div className="four wide column">
          {uploaderDisplay}
          {uploaderButtonDisplay}
        </div>

        <div className="twelve wide column ">
          <input
            placeholder="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {/* <select value={type} onChange={e => setType(e.target.value)}>
            <option value="crew">crew</option>
            <option value="cast">cast</option>
          </select> */}
          <input
            placeholder="job"
            type="text"
            value={job}
            onChange={e => setJob(e.target.value)}
          />
          <textarea
            placeholder="about"
            value={about}
            onChange={e => setAbout(e.target.value)}
          />
          <div className="form-field">
            <label>Reihenfolge:</label>
            <input
              min="0"
              value={ord}
              onChange={e => setOrd(e.target.value)}
              type="number"
            />
          </div>
          <button onClick={onSubmitClick}>Hinzufügen</button>
        </div>
      </div>
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

export default CrewForm;
