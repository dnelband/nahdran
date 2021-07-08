import { useEffect, useState } from 'react';
import Content from './partials/Content';
import './style/page.css';
import './style/home.css';

function Page(props) {
  const [page, setPage] = useState();
  const [content, setContent] = useState();
  const initBgClass =
    window.innerHeight * 1.33 < window.innerWidth ? 'max-width' : 'max-height';
  const [bgClass, setBgClass] = useState(initBgClass);
  const [fullBgLoaded, setFullBgLoaded] = useState(false);
  const [fullBgHeight, setFullBgHeight] = useState(null);
  const [fullBgImageBottomAdjustment, setFullBgImageBottomAdjustment ] = useState(null);
  const [fullBgImageLeftAdjustment, setFullBgImageLeftAdjustment ] = useState(null);

  const [fullBgOpcaity, setFullBgOpcaity ] = useState(0);

  useEffect(() => {
    getPage();
    // window.addEventListener('resize', updateBgClass);
  }, []);

  /*function updateBgClass() {
    let initBgClass, initFullBgImageBottomAdjustment;
    if (window.innerHeight * 1.33 < window.innerWidth){
      initBgClass =  'max-width';
      if (fullBgHeight !== null) initFullBgImageBottomAdjustment = fullBgHeight - window.innerHeight - 45
    } else initBgClass = 'max-height'; 
    setBgClass(initBgClass);
    if (initFullBgImageBottomAdjustment) setFullBgImageBottomAdjustment(initFullBgImageBottomAdjustment);
  }*/

  useEffect(() => {
    if (page) getContent();
  }, [page]);

  useEffect(() => {
    if (fullBgOpcaity > 0 && fullBgOpcaity < 1) {
      setTimeout(() => {
        const newFullBgopcaity = fullBgOpcaity + 0.1;
        setFullBgOpcaity(newFullBgopcaity);
      }, 10);
    }
  },[fullBgOpcaity])

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

  /*function onFinishThumbBGLoad(e){
    if (window.innerHeight * 1.33 < window.innerWidth){
      setFullBgHeight(e.target.offsetHeight);
      setFullBgImageBottomAdjustment(e.target.offsetHeight - window.innerHeight - 45);
    }
    if (e.target.offsetWidth > window.innerWidth){
      setFullBgImageLeftAdjustment((e.target.offsetWidth - window.innerWidth) / 2);
    }
  }

  function onFinishFullBgLoad(){
    setFullBgLoaded(true);
    setFullBgOpcaity(0.1);
  }*/

  let contentDisplay;
  if (content) {
    contentDisplay = content.map((ct, i) => (
      <Content key={i} ct={ct}></Content>
    ));
  }

  /*
  let fullBgImageStyle = {opacity:fullBgOpcaity}
  let thumbBgImageStyle = {}
  let bottomAdjustment = 0;
  if (fullBgImageBottomAdjustment !== null) bottomAdjustment = 0 - fullBgImageBottomAdjustment;
  if (page && page.background_image_bottom !== null) bottomAdjustment += parseInt(page.background_image_bottom);
  if (bottomAdjustment){
    fullBgImageStyle.bottom = bottomAdjustment + "px";
    thumbBgImageStyle.bottom = bottomAdjustment + "px";
  }
  let leftAdjustment = 0;
  if (fullBgImageLeftAdjustment) leftAdjustment = 0 - fullBgImageLeftAdjustment;
  if (leftAdjustment){
    fullBgImageStyle.left = leftAdjustment + "px";
    thumbBgImageStyle.left = leftAdjustment + "px";    
  }*/

  let pageStyle = {}
  if (page && page.background_image){
    let screenRatio =  1.777777777778;
    let bgPosY = (window.innerHeight * screenRatio < window.innerWidth) && page.background_image_bottom ?  '-' + page.background_image_bottom + "px" : 'top'; 
    let bgPosX = (window.innerHeight * screenRatio > window.innerWidth) && page.background_image_left ? page.background_image_left : 'center'; 
    pageStyle = {
      backgroundImage:`url('${page.background_image}')`,
      backgroundPositionY:bgPosY,
      backgroundPositionX:bgPosX
    }
  }


  let contentContainerDisplay = (
    <div
      className={
        'content-container visible'
      }
    >
      <div className="content-display">{contentDisplay}</div>
    </div>
  );
  if (props.path === 'home') {
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

  return (
    <div style={pageStyle} className="page" id={props.path}>
      {contentContainerDisplay}
    </div>
  );
}

/*

      <div className="background">
        <img
          className={'background-img ' + bgClass + ' small-bg'}
          src={page ? thumbnailSrc : ''}
          style={thumbBgImageStyle}
          onLoad={e => onFinishThumbBGLoad(e)}
        />
        <img
          className={
            'background-img ' +
            bgClass +
            ' full-bg' +
            (fullBgLoaded === true ? ' visible' : '')
          }
          style={fullBgImageStyle}
          src={page ? page.background_image : ''}
          onLoad={() => onFinishFullBgLoad()}
        />

      </div>

*/

export default Page;
