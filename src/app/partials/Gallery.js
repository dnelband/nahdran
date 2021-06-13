import { useEffect, useState } from 'react';
import { SRLWrapper } from 'simple-react-lightbox';
import './../style/gallery.css';
import $ from 'jquery';

function Gallery(props) {
  const [galleryContent, setGalleryContent] = useState();
  const [galleryItems, setGalleryItems] = useState([]);
  const [sliderWidth, setSliderWidth] = useState(
    window.innerWidth * 0.99 - 60.1
  );
  const [itemWidth, setItemWidth] = useState(sliderWidth / 3);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [stopAutoSlide, setStopAutoSlide] = useState(false);
  const [imgHeight, setImgHeight] = useState();
  console.log(imgHeight);

  let mySliderInterval;

  useEffect(() => {
    getGalleryContent();
    getGalleryItems();
  }, []);

  useEffect(() => {
    if (galleryItems.length > 0 && stopAutoSlide === false) {
      mySliderInterval = setInterval(function () {
        onLeftArrowClick();
      }, 2500);
    }
    return () => {
      window.clearInterval(mySliderInterval);
    };
  }, [sliderPosition, galleryItems, stopAutoSlide]);

  useEffect(() => {
    setTimeout(function () {
      setStopAutoSlide(false);
    }, 10000);
  }, []);

  function getGalleryContent() {
    fetch(`/db/galleries/${props.galleryId}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setGalleryContent(result);
      });
  }

  function getGalleryItems() {
    fetch(`/db/galleryitemsbygallery/${props.galleryId}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setGalleryItems(result);
      });
  }

  function onLeftArrowClick(isClearInterval) {
    let maxSliderPosition = 0 - (galleryItems.length - 3) * itemWidth;
    let newSliderPostion = sliderPosition - itemWidth;
    if (newSliderPostion === maxSliderPosition) {
      newSliderPostion = 0;
    }
    if (isClearInterval === true) {
      setStopAutoSlide(true);
    }
    setSliderPosition(newSliderPostion);
  }

  function onRightArrowClick(isClearInterval) {
    let newSliderPostion = sliderPosition + itemWidth;
    if (newSliderPostion > 0) {
      newSliderPostion = 0 - (galleryItems.length - 3) * itemWidth;
    }
    if (isClearInterval === true) {
      setStopAutoSlide(true);
    }
    setSliderPosition(newSliderPostion);
  }

  let galleryItemsDisplay;
  if (galleryItems) {
    galleryItemsDisplay = galleryItems.map((gi, i) => (
      <GalleryItem
        itemWidth={itemWidth}
        key={i}
        i={i}
        gi={gi}
        setImgHeight={setImgHeight}
      />
    ));
  }

  let galleryContentDisplay;
  if (galleryContent) {
    galleryContentDisplay = (
      <div>
        <h1> {galleryContent.title}</h1>
        <p> {galleryContent.description}</p>
      </div>
    );
  }

  return (
    <div>
      {galleryContentDisplay}
      <div className="arrow-container">
        <a
          id="left-arrow"
          className="slider-arrow"
          onClick={() => onLeftArrowClick(true)}
          style={{ top: imgHeight / 2 - 35 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            fill="currentColor"
            className="bi bi-chevron-compact-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"
            />
          </svg>
        </a>
        <a
          id="right-arrow"
          className="slider-arrow"
          onClick={() => onRightArrowClick(true)}
          style={{ top: imgHeight / 2 - 35 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            fill="currentColor"
            className="bi bi-chevron-compact-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"
            />
          </svg>
        </a>
      </div>
      <div
        id="slider-container"
        className="slider-container"
        style={{ width: sliderWidth }}
      >
        <div
          className="slider"
          style={{
            width: itemWidth * galleryItems.length,
            marginLeft: sliderPosition,
          }}
        >
          <SRLWrapper>{galleryItemsDisplay}</SRLWrapper>
        </div>
      </div>
    </div>
  );
}

// this function is times the amount we have items
function GalleryItem(props) {
  const gi = props.gi;

  function onImgLoad(e) {
    // #1 get onImgLoad
    // #2 get height of the img
    // #3 pass the height to parent
    // #4 center arrow to height
    if (props.i === 1) {
      props.setImgHeight(e.target.height);
      console.log(e.target.height);
    }
  }

  let itemDisplay;
  if (gi.type === 'picture') {
    itemDisplay = (
      <img
        className="gallery-items"
        onLoad={e => onImgLoad(e)}
        src={__dirname + gi.thumbnail}
        width={props.itemWidth}
      ></img>
    );
  } else if (gi.type === 'video') {
    itemDisplay = (
      <video src={__dirname + gi.filepath} width={props.itemWidth} controls>
        <source
          src={__dirname + gi.filepath}
          type={
            'video/' + gi.filepath.split('.')[gi.filepath.split('.').length - 1]
          }
        ></source>
      </video>
    );
  }
  return <span>{itemDisplay}</span>;
}
export default Gallery;
