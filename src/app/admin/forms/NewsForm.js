import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import TextEditor from '../../partials/TextEditor';

function NewsForm(props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState(props.type === 'edit' ? null : '');

  useState(() => {
    if (props.itemId) {
      fetch('/db/news/' + props.itemId)
        .then(res => res.text())
        .then(res => {
          setTitle(JSON.parse(res)[0].title);
          setText(JSON.parse(res)[0].text);
        });
    }
  }, []);

  function onSubmitClick() {
    const newNewsItem = { title, text };

    let ajaxMethod = 'POST';
    if (props.type === 'edit') ajaxMethod = 'PUT';

    $.ajax({
      url: '/db/news/' + (props.type === 'edit' ? props.itemId : ''),
      method: ajaxMethod,
      data: newNewsItem,
    }).done(function (res) {
      window.location.href =
        props.type === 'edit'
          ? '/admin/edit/news/' + parseInt(props.itemId)
          : '/admin/news/';
    });
  }

  let textEditorDisplay;
  if (text !== null) {
    textEditorDisplay = (
      <TextEditor
        val={text}
        onTextEditorUpdate={setText}
        // placeholder="text"
        // value={text}
        // onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <div className="news-form">
      <input
        placeholder="title"
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {textEditorDisplay}
      <button onClick={onSubmitClick}>
        {props.type === 'edit' ? 'Aktualisieren' : 'Hinzufügen'}
      </button>
    </div>
  );
}

export default NewsForm;
