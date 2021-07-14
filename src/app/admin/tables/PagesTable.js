import React, { useEffect, useState } from 'react';
import $ from 'jquery';

function PagesTable() {
  const [pages, setPages] = useState();

  useEffect(() => {
    fetch('/db/pages')
      .then(res => res.text())
      .then(res => {
        setPages(JSON.parse(res));
      });
  }, []);

  let tableHeader, tableRowsDisplay;
  if (pages) {
    tableRowsDisplay = pages.map((p, index) => (
      <PagesTableItem page={p} key={index} />
    ));
  }

  return (
    <div>
      <div className="section-header ui secondary menu">
        <h1>Seiten</h1>
        <div className="ui right menu secondary">
          <div>
            {/* <a
              href="/admin/create/page"
              className="ui green button labeled icon"
            >
              <i className="plus icon"></i> Add Page
            </a> */}
          </div>
        </div>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Rehienfolge</th>
            <th>Bearbeiten</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function PagesTableItem(props) {
  const p = props.page;

  // function onDeletePageClick() {
  //   $.ajax({
  //     url: '/db/pages/' + p.page_id,
  //     method: 'DELETE',
  //   }).done(function (res) {
  //     window.location.href = '/admin/pages/';
  //   });
  // }
  return (
    <tr>
      <td width="50%">{p.title}</td>
      <td>{p.ord}</td>
      <td>
        <a
          href={'/admin/edit/page/' + p.page_id}
          className="ui primary button icon"
        >
          <i className="pencil icon"></i>
        </a>
        {/* <button onClick={onDeletePageClick} className="ui red button icon">
          <i className="remove icon"></i>
        </button> */}
      </td>
    </tr>
  );
}

export default PagesTable;
