import { useEffect, useState } from 'react';
import Content from './partials/Content';
import './style/page.css';
import './style/home.css';

function Page(props) {
  const [page, setPage] = useState();
  const [content, setContent] = useState();

  useEffect(() => {
    getPage();
  }, []);

  useEffect(() => {
    if (page) getContent();
  }, [page]);

  function getPage() {
    fetch(`/db/pages/${props.path}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setPage(result);
      });
  }

  function getContent() {
    fetch(`/db/contentsbypage/${page.page_id}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setContent(result);
      });
  }

  let contentDisplay;
  if (content) {
    contentDisplay = content.map((ct, i) => (
      <Content key={i} ct={ct}></Content>
    ));
  }

  let pageStyle = {};
  if (page && page.background_image) {
    let screenRatio = 1.777777777778;
    let bgPosY =
      window.innerHeight * screenRatio < window.innerWidth &&
      page.background_image_bottom
        ? '-' + page.background_image_bottom + 'px'
        : 'top';
    let bgPosX =
      window.innerHeight * screenRatio > window.innerWidth &&
      page.background_image_left
        ? page.background_image_left
        : 'center';
    pageStyle = {
      backgroundImage: `url('${page.background_image}')`,
      backgroundPositionY: bgPosY,
      backgroundPositionX: bgPosX,
    };
  }

  let contentContainerDisplay = (
    <div className={'content-container visible'}>
      <div className="content-display">{contentDisplay}</div>
    </div>
  );

  if (props.path === 'Home') {
    contentContainerDisplay = (
      <div className="home-page-container">
        <div className="video-container">
          <video
            autoPlay
            muted
            src={__dirname + 'trailer.mp4'}
            width={'100%'}
            controls
          >
            <source src={__dirname + 'trailer.mp4'} type={'video/mp4'}></source>
          </video>
        </div>
        <div className="title-container">
          <img src={__dirname + 'title.png'} />
          {contentDisplay}
        </div>
      </div>
    );
  }

  let pageClassName = '';
  if (props.path === 'Regie_&_Team' || props.path === 'Hinter_den_Kulissen')
    pageClassName += 'content-left ';
  if (props.path === 'Hinter_den_Kulissen') {
    pageClassName += 'spacing-top';
  }
  return (
    <div style={pageStyle} className={'page ' + pageClassName} id={props.path}>
      {contentContainerDisplay}
    </div>
  );
}

export default Page;
