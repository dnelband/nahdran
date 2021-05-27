
import { useEffect, useState } from "react";

function News(props){

    const [ news, setNews] = useState();

    useEffect(() => {
        fetch('/db/news/').then(res => res.text()).then(res => {
            setNews(JSON.parse(res));
        });
    },[])

    let newsDisplay;
    if (news){
        newsDisplay = news.map((ni,index) => (
            <div className="news-item">
                <h2>{ni.title}</h2>
                <p>{ni.text}</p>
                <span>{ni.created_at}</span>
                <hr/>
            </div>
        ))
    }

    return (
        <div className="new-container">
            {newsDisplay}
        </div>
    )
}

export default News;