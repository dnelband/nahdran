import React from 'react';
import Gallery from './Gallery';
import Crew from './Crew';
import News from './News';
import ContactForm from './ContactForm';

function Content(props) {
  const content = props.ct;
  let contentDisplay;
  if (content.type === 'html') {
    contentDisplay = (
      <div
        className="content-value"
        dangerouslySetInnerHTML={{ __html: content.value }}
      ></div>
    );
  } else if (content.type === 'gallery') {
    contentDisplay = <Gallery galleryId={content.value}></Gallery>;
  } else if (content.type === 'crew') {
    contentDisplay = <Crew></Crew>;
  } else if (content.type === 'news') {
    contentDisplay = <News></News>;
  } else if (content.type === 'contact') {
    contentDisplay = <ContactForm></ContactForm>;
  }

  return <div>{contentDisplay}</div>;
}

export default Content;
