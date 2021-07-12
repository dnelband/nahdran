import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import MyDropzone from '../../partials/DropZone';
import ContentsForm from './ContentsForm';
import pagesAdmin from './../../style/pagesAdmin.css';

function PageForm(props) {
  const [title, setTitle] = useState('');
  let defLink = title.split('%20').join('_');
  const [link, setLink] = useState(defLink);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [order, setOrder] = useState(0);
  const [contents, setContents] = useState([]);
  const [showContentsForm, setShowContentsForm] = useState(false);
  const [error, setError] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const previousBg = usePrevious(backgroundImage);

  useEffect(() => {
    if (props.type === 'edit') {
      getPage();
      getContents();
    }
  }, []);

  useEffect(() => {
    if (backgroundImage && previousBg && backgroundImage !== previousBg) {
      onSubmitClick();
    }
  }, [backgroundImage]);

  function getPage() {
    fetch('/db/pagesbyid/' + props.itemId)
      .then(res => res.text())
      .then(res => {
        const page = JSON.parse(res)[0];
        setTitle(page.title);
        setLink(page.link);
        setBackgroundImage(page.background_image);
        setOrder(page.ord);
      });
  }

  function getContents() {
    fetch('/db/contentsbypage/' + props.itemId)
      .then(res => res.text())
      .then(res => {
        setContents(JSON.parse(res));
      });
  }

  function onSetTitle(val) {
    setTitle(val);
    let newVal = val.split(' ').join('_');
    setLink(newVal);
  }

  // function onSetLink(val) {
  //   let newVal = val.split(' ').join('_');
  //   setLink(newVal);
  // }

  function onSetBackgroundImage(data) {
    setBackgroundImage(data.path);
  }

  function onSubmitClick() {
    setError('');
    const newPage = {
      title,
      link,
      background_image: backgroundImage,
      ord: order,
    };

    let ajaxMethod = 'POST';
    if (props.type === 'edit') ajaxMethod = 'PUT';

    $.ajax({
      url: '/db/pages/' + (props.type === 'edit' ? props.itemId : ''),
      method: ajaxMethod,
      data: newPage,
    }).done(function (res) {
      if (res.message)
        window.location.href =
          props.type === 'edit'
            ? '/admin/edit/page/' + parseInt(props.itemId)
            : '/admin/pages/';
      else setError('Page title must be unique!');
    });
  }

  let pageContentsDisplay;
  if (props.type === 'edit') {
    // const addContentsButtonDisplay = (
    //   <button
    //     onClick={() =>
    //       setShowContentsForm(showContentsForm === true ? false : true)
    //     }
    //   >
    //     Add Contents
    //   </button>
    // );

    let contentsFormDisplay;
    if (showContentsForm === true)
      contentsFormDisplay = (
        <ContentsForm
          pageId={props.itemId}
          type={'create'}
          onCreateItem={props.onCreateItem}
        />
      );

    let contentsDisplay;
    if (contents && contents.length > 0) {
      let filteredArray = contents.filter(
        ct => ct.type === 'gallery' || ct.type === 'html'
      );
      console.log(filteredArray);
      contentsDisplay = filteredArray.map((ct, index) => (
        <React.Fragment>
          <ContentsForm
            type={'edit'}
            pageId={props.itemId}
            onUpdateItem={props.onUpdateItem}
            key={index}
            contents={ct}
          />
          <hr />
        </React.Fragment>
      ));
    } else contentsDisplay = <div>no contents</div>;

    pageContentsDisplay = (
      <div className="contents-container">
        {contentsFormDisplay}
        {contentsDisplay}
      </div>
    );
  }

  let uploaderDisplay;
  if (showUploader === true) {
    uploaderDisplay = (
      <MyDropzone
        image={backgroundImage}
        onFinishUpload={onSetBackgroundImage}
      />
    );
  } else {
    uploaderDisplay = (
      <img width="100%" height="auto" src={__dirname + backgroundImage} />
    );
  }

  let uploaderButtonDisplay;
  if (showUploader === false) {
    uploaderButtonDisplay = (
      <a onClick={() => setShowUploader(showUploader === true ? false : true)}>
        <i className="redo icon"></i>
        Hintergrund ändern
      </a>
    );
  }

  return (
    <div className="page-form">
      <div className="ui segment">
        <h1>{title ? title : ''}</h1>
        <div className="ui grid">
          <div className="ten wide column">
            <div className="form-field">
              <div className="uploader"> {uploaderDisplay}</div>
              {uploaderButtonDisplay}
            </div>
          </div>

          <div className="six wide column">
            <div className="form-field">
              <label>Titel</label>
              <input
                value={title}
                onChange={e => onSetTitle(e.target.value)}
                type="text"
              />
            </div>
            {error}

            <div className="form-field">
              <label>Reihenfolge:</label>
              <input
                min="0"
                value={order}
                onChange={e => setOrder(e.target.value)}
                type="number"
              />
            </div>
            <a onClick={onSubmitClick} className="ui primary button">
              {props.type === 'edit' ? 'Aktualisieren' : 'Erstellen'}
            </a>
          </div>
        </div>
      </div>

      {pageContentsDisplay}
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

export default PageForm;
