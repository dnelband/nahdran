import { useEffect, useState } from 'react';

function News(props) {
  // state var for news
  const [news, setNews] = useState();
  console.log(news);

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
      <div key={i}>
        <h3>{n.title}</h3>
        <p>{n.text}</p>
      </div>
    ));
  }
  return <div>{displayNews}</div>;
}

export default News;
