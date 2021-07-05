import { useEffect, useState } from 'react';
import '././../style/news.css';

function News(props) {
  // state var for news
  const [news, setNews] = useState();

  useEffect(() => {
    getNews();
  }, []);

  // fetch the data
  function getNews() {
    fetch('/db/news/')
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setNews(result);
      });
  }
  // display the data
  let displayNews;

  if (news) {
    displayNews = news.map((n, i) => (
      <div className="news-container" key={i}>
        <h3>{n.title}</h3>
        <p dangerouslySetInnerHTML={{ __html: n.text }}></p>
        <div className="created-at">{n.created_at.split(' ')[0]}</div>
        <hr></hr>
      </div>
    ));
  }
  return <div>{displayNews}</div>;
}

export default News;
