import { useEffect, useState } from 'react';
import Content from './partials/Content';
import './style/page.css';

function Page(props) {
  const [page, setPage] = useState();
  const [content, setContent] = useState();
  const initBgClass =
    window.innerHeight * 1.33 < window.innerWidth ? 'max-width' : 'max-height';
  const [bgClass, setBgClass] = useState(initBgClass);
  const [fullBgLoaded, setFullBgLoaded] = useState(false);
  const [fullBgHeight, setFullBgHeight] = useState(null);
  const [fullBgImageBottomAdjustment, setFullBgImageBottomAdjustment ] = useState(null);
  const [fullBgOpcaity, setFullBgOpcaity ] = useState(0);

  useEffect(() => {
    getPage();
    window.addEventListener('resize', updateBgClass);
  }, []);

  function updateBgClass() {
    let initBgClass, initFullBgImageBottomAdjustment;
    if (window.innerHeight * 1.33 < window.innerWidth){
      initBgClass =  'max-width';
      if (fullBgHeight !== null) initFullBgImageBottomAdjustment = fullBgHeight - window.innerHeight - 45
    } else initBgClass = 'max-height'; 
    setBgClass(initBgClass);
    if (initFullBgImageBottomAdjustment) setFullBgImageBottomAdjustment(initFullBgImageBottomAdjustment);
  }

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

  function onFinishThumbBGLoad(e){
    if (window.innerHeight * 1.33 < window.innerWidth){
      setFullBgHeight(e.target.offsetHeight);
      setFullBgImageBottomAdjustment(e.target.offsetHeight - window.innerHeight - 45);
    }
  }

  function onFinishFullBgLoad(){
    setFullBgLoaded(true);
    setFullBgOpcaity(0.1);
  }

  let contentDisplay;
  if (content) {
    contentDisplay = content.map((ct, i) => (
      <Content key={i} ct={ct}></Content>
    ));
  }

  let thumbnailSrc;
  if (page) thumbnailSrc = 'thumbnails/' + page.background_image.split('/')[1];

  let fullBgImageStyle = {opacity:fullBgOpcaity}
  if (fullBgImageBottomAdjustment !== null) fullBgImageStyle.bottom = "-" + fullBgImageBottomAdjustment + "px";

  let thumbBgImageStyle = {}
  if (fullBgImageBottomAdjustment !== null) thumbBgImageStyle.bottom = "-" + fullBgImageBottomAdjustment + "px";

  return (
    <div className="page" id={props.path}>
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
        <div
          className={
            'content-container' + (fullBgLoaded === true ? ' visible' : '')
          }
        >
          <div className="content-display">{contentDisplay}</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
