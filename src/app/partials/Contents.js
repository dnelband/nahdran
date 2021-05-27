
import Gallery from './Gallery';
import News from './News';
import Crew from './Crew';
import ContactForm from './ContactForm';

function Contents(props){
    const c = props.content;

    let contentDisplay;
    if (c.type === "html") contentDisplay = <div dangerouslySetInnerHTML={{__html:c.value}}></div>
    else if (c.type === "gallery") contentDisplay = <Gallery galleryId={c.value}/>
    else if (c.type === "contact") contentDisplay = <ContactForm />
    else if (c.type === "news") contentDisplay = <News />
    else if (c.type === "crew") contentDisplay = <Crew />

    return (
        <div className="contents-item">
            {contentDisplay}
        </div>
    )
}

export default Contents;