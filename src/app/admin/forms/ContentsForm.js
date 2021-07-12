import React, { useState, useEffect } from 'react';
import $, { isEmptyObject } from 'jquery';
import GalleryForm from './GalleryForm';
import NewsTable from '../tables/NewsTable';
import TextEditor from '../../partials/TextEditor';

function ContentsForm(props) {
  const ct = props.contents;
  const contentTypes = [
    'gallery',
    'html',
    'news',
    'crew',
    'contact',
    'homepage',
  ];
  const [contentType, setContentType] = useState(ct ? ct.type : '');
  const [val, setVal] = useState(ct ? ct.value : '');
  const [ord, setOrd] = useState(ct ? ct.ord : 0);

  useEffect(() => {
    if (contentType === 'homepage') setVal(0);
  }, [contentType]);

  function onSubmitClick(id) {
    let value = val;
    if (Number(id)) value = id;
    const newContent = {
      page_id: ct ? ct.page_id : props.pageId,
      type: contentType,
      value: value,
      ord: parseInt(ord),
    };
    let ajaxMethod = 'POST';
    if (props.type === 'edit') ajaxMethod = 'PUT';
    $.ajax({
      url: '/db/contents/' + (props.type === 'edit' ? ct.content_id : ''),
      method: ajaxMethod,
      data: newContent,
    }).done(function (res) {
      window.location.href =
        '/admin/edit/page/' + (ct ? ct.page_id : props.pageId);
    });
  }

  // function deleteContents() {
  //   $.ajax({
  //     url: '/db/contents/' + ct.content_id,
  //     method: 'DELETE',
  //   }).done(function (res) {
  //     if (ct.type === 'galleries') deleteItem('galleries', ct.value);
  //     else window.location.href = '/admin/edit/page/' + props.pageId;
  //   });
  // }

  function deleteItem(it, id) {
    $.ajax({
      url: '/db/' + it + '/' + id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/edit/page/' + props.pageId;
    });
  }

  let contentsDisplay;
  if (contentType === 'html') {
    contentsDisplay = (
      /*<textarea value={val} onChange={e => setVal(e.target.value)}></textarea>*/
      <TextEditor val={val} onTextEditorUpdate={setVal} />
    );
  } else if (contentType === 'gallery')
    contentsDisplay = (
      <GalleryForm
        onCreateGallery={onSubmitClick}
        type={props.type}
        pageId={props.pageId}
        galleryId={ct ? ct.value : null}
      />
    );

  let submitButtonDisplay = (
    <button className="ui primary button" onClick={onSubmitClick}>
      Aktualisieren
    </button>
  );
  if (props.type === 'edit' && contentType === 'gallery')
    submitButtonDisplay = null;

  return (
    <div className="ui segment">
      <div className="contents-form">
        {contentsDisplay}
        {submitButtonDisplay}
      </div>
    </div>
  );
}

export default ContentsForm;
