import { useEffect, useState } from "react";
import crew from "././../style/crew.css";

function Crew(props) {
  // state var, crew members
  const [crewMembers, setCrewMembers] = useState();
  console.log(crewMembers);

  useEffect(() => {
    getCrewMembers();
  }, []);

  // fetch crew members from db
  function getCrewMembers() {
    fetch("/db/crew/")
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res);
        setCrewMembers(result);
      });
  }

  let displayCrewMembers;
  if (crewMembers) {
    displayCrewMembers = crewMembers.map((cm, i) => (
      <div className="crew" key={i}>
        <img className="profile-img" src={cm.picture} width="100" />
        <h3 className="name">{cm.name}</h3>
        <span className="job">{cm.job}</span>
        <p className="about">{cm.about}</p>
      </div>
    ));
  }
  // display all of them
  return <div className="display-crew">{displayCrewMembers}</div>;
}

export default Crew;
