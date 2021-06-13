import { useEffect, useState } from 'react';

function Crew(props) {
  // state var, crew members
  const [crewMembers, setCrewMembers] = useState();
  console.log(crewMembers);

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
      <div key={i}>
        <img src={cm.picture} width="100"></img>
        <h3>{cm.name}</h3>
        <span>{cm.job}</span>
        <p>{cm.about}</p>
      </div>
    ));
  }
  // display all of them
  return <div>{displayCrewMembers}</div>;
}

export default Crew;
