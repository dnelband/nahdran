
import { useEffect, useState } from "react";

function Crew(props){

    const [ crew, setCrew ] = useState(); 

    useEffect(() => {
        fetch('/db/crew/').then(res => res.text()).then(res => {
            setCrew(JSON.parse(res));
        });
    },[])

    let crewMembersDisplay;
    if (crew){
        crewMembersDisplay = crew.map((cm,index) => (
            <div className="crew-member eight wide column">
                <img width="100" src={cm.picture}/>
                <h2>{cm.name}</h2>
                <h4>{cm.job}</h4>
                <p>{cm.about}</p>
            </div>
        ))
    }


    return (
        <div className="cast-crew-container">
            <div className="ui grid">
                {crewMembersDisplay}
            </div>
        </div>
    )
}

export default Crew;