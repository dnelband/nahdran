import React, { useEffect, useState } from 'react';
import $ from 'jquery';

function CrewTable() {
  const [crew, setCrew] = useState();

  useEffect(() => {
    fetch('/db/crew/')
      .then(res => res.text())
      .then(res => {
        setCrew(JSON.parse(res));
      });
  }, []);

  let tableRowsDisplay;
  if (crew) {
    tableRowsDisplay = crew.map((cm, index) => (
      <CrewTableItem crewMember={cm} key={index} />
    ));
  }

  return (
    <div>
      <div className="section-header ui secondary menu">
        <h1>{'Cast & Crew'}</h1>
        <div className="ui right menu secondary">
          <div>
            <a
              href="/admin/create/crew"
              className="ui green button labeled icon"
            >
              <i className="plus icon"></i> Add Crew Member
            </a>
          </div>
        </div>
      </div>
      <hr />
      <table className="ui celled padded table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Job</th>
            <th>Type</th>
            <th>About</th>
            <th>Order</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{tableRowsDisplay}</tbody>
      </table>
    </div>
  );
}

function CrewTableItem(props) {
  const cm = props.crewMember;

  function onDeleteCrewMemberClick() {
    $.ajax({
      url: '/db/news/' + cm.crew_id,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/crew/';
    });
  }

  return (
    <tr>
      <td className="collapsing">{cm.crew_id}</td>
      <td>
        <img width="50" src={__dirname + cm.picture} />
      </td>
      <td>{cm.name}</td>
      <td>{cm.job}</td>
      <td>{cm.type ? cm.type : 'crew'} </td>
      <td>{cm.about}</td>
      <td>{cm.ord}</td>
      <td>
        <a
          href={'/admin/edit/crew/' + cm.crew_id}
          className="ui primary button icon"
        >
          <i className="pencil icon"></i>
        </a>
        <button
          onClick={onDeleteCrewMemberClick}
          className="ui red button icon"
        >
          <i className="remove icon"></i>
        </button>
      </td>
    </tr>
  );
}

export default CrewTable;
