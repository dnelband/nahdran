import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function NewsTable() {
  const [news, setNews] = useState();

  useEffect(() => {
    fetch('/db/news/')
      .then(res => res.text())
      .then(res => {
        console.log(JSON.parse(res));
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
        <h1>News</h1>
        <div className="ui right menu secondary">
          <div>
            <a
              href="/admin/create/news"
              className="ui green button labeled icon"
            >
              <i className="plus icon"></i> Add News Item
            </a>
          </div>
        </div>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Text</th>
            <th>Date Created</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function NewsTableItem(props) {
  const ni = props.newsItem;

  function onDeleteNewsItemClick() {
    $.ajax({
      url: '/db/news/' + ni.news_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/news/';
    });
  }

  return (
    <tr>
      <td className="collapsing">{ni.news_id}</td>
      <td>{ni.title}</td>
      <td>{ni.text} </td>
      <td>{ni.created_at}</td>
      <td>
        <a
          href={'/admin/edit/news/' + ni.news_id}
          className="ui primary button icon"
        >
          <i className="pencil icon"></i>
        </a>
        <button onClick={onDeleteNewsItemClick} className="ui red button icon">
          <i className="remove icon"></i>
        </button>
      </td>
    </tr>
  );
}

export default NewsTable;
