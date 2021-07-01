import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import MyDropzone from '../../partials/DropZone';

function CrewForm(props) {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [type, setType] = useState('');
  const [picture, setPicture] = useState('');
  const [about, setAbout] = useState('');
  const [ord, setOrd] = useState(0);

  useState(() => {
    if (props.itemId) {
      fetch('/db/crew/' + props.itemId)
        .then(res => res.text())
        .then(res => {
          console.log(res);
          setName(JSON.parse(res)[0].name);
          setJob(JSON.parse(res)[0].job);
          setType(JSON.parse(res)[0].type);
          setPicture(JSON.parse(res)[0].picture);
          setAbout(JSON.parse(res)[0].about);
          setOrd(JSON.parse(res)[0].ord);
        });
    }
  }, []);

  function onSubmitClick() {
    const newCrewMember = {
      name,
      job,
      type,
      picture,
      about,
      ord: parseInt(ord),
    };

    console.log(newCrewMember);
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

  return (
    <div className="crew-form">
      <div className="ui grid">
        <div className="four wide column">
          <img width="100" src={__dirname + picture} />
          <MyDropzone image={picture} onFinishUpload={onSetPicture} />
        </div>
        <div className="twelve wide column ">
          <input
            placeholder="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="crew">crew</option>
            <option value="cast">cast</option>
          </select>
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
            <label>Order ( 0 = last )</label>
            <input
              min="0"
              value={ord}
              onChange={e => setOrd(e.target.value)}
              type="number"
            />
          </div>
          <button onClick={onSubmitClick}>{props.type} crew member</button>
        </div>
      </div>
    </div>
  );
}

export default CrewForm;
