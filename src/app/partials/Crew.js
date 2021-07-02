import React, { useEffect, useState } from 'react';
import '././../style/crew.css';

function Crew(props) {
  // state var, crew members
  const [crewMembers, setCrewMembers] = useState();

  useEffect(() => {
    getCrewMembers();
  }, []);

  // fetch crew members from db
  function getCrewMembers() {
    fetch('/db/crew/')
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setCrewMembers(result);
      });
  }

  let displayCrewMembers;
  if (crewMembers) {
    displayCrewMembers = crewMembers.map((cm, i) => (
      <CrewMember key={i} i={i} cm={cm} />
    ));
  }

  // display all of them
  return <div className="display-crew">{displayCrewMembers}</div>;

  function CrewMember(props) {
    const cm = props.cm;
    const i = props.i;
    const [readMore, setReadMore] = useState(false);

    // setabout to true or false
    // if the about is more than 100 characters (.lenght >= 100) then only display 100 and add a read more button
    // onClick on button show cm.about

    let displayAbout =
      cm.about.length > 550 ? `${cm.about.substring(0, 550)}...` : cm.about;

    if (readMore === true) {
      displayAbout = cm.about;
    }

    let readMoreButton = (
      <React.Fragment>
        Read more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-chevron-double-down"
          viewBox="0 0 16 10"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
          <path
            fill-rule="evenodd"
            d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </React.Fragment>
    );
    if (readMore === true) {
      readMoreButton = (
        <React.Fragment>
          Read less
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-double-up"
            viewBox="0 0 16 10"
          >
            <path
              fill-rule="evenodd"
              d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"
            />
            <path
              fill-rule="evenodd"
              d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
            />
          </svg>
        </React.Fragment>
      );
    }

    let titleDisplayTop;
    let titleDisplayInAbout;
    if (window.innerWidth >= 1020) {
      titleDisplayInAbout = (
        <div className="title-container">
          <h3 className="name">{cm.name}</h3>
          <span className="job">{cm.job}</span>
        </div>
      );
    } else {
      titleDisplayTop = (
        <div className="title-container">
          <h3 className="name">{cm.name}</h3>
          <span className="job">{cm.job}</span>
        </div>
      );
    }

    return (
      <div className="crew" key={i}>
        <div className="img-container">
          <img className="profile-img" src={cm.picture} width="100" />
          {titleDisplayTop}
        </div>
        <div className="about-container">
          {titleDisplayInAbout}
          <p className="about">
            {displayAbout}
            <a
              onClick={() => setReadMore(readMore === true ? false : true)}
              className="read-more"
            >
              {readMoreButton}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Crew;
