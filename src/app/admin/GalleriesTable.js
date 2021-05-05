import { useEffect, useState } from 'react';
import  MyDropzone from '../partials/DropZone';
import { SRLWrapper } from "simple-react-lightbox";

function GalleriesTable(){

    const [ galleries, setgalleries ] = useState(); 

    useEffect(() => {
        fetch('/db/galleries').then(res => res.text()).then(res => {
            setgalleries(JSON.parse(res));
        });
    },[])

    let galleriesDisplay;
    if (galleries){
        galleriesDisplay = galleries.map((g,index) => (
            <Gallery gallery={g} key={index}/>
        ))
    }

    return (
        <div className="table">
            {galleriesDisplay}
        </div>
    )
}


export function Gallery(props){
    const g = props.gallery;
    const [ galleryItems, setGalleryItems ] = useState();
    useEffect(() => {
        fetch('/db/galleryitemsbygallery/'+g.gallery_id).then(res => res.text()).then(res => {
            setGalleryItems(JSON.parse(res));
        });
    },[])

    let galleryItemsDisplay;
    if (galleryItems){
        galleryItemsDisplay = galleryItems.map((gi,index) => {
            if (gi.type === "picture"){
                return (
                    <img width="150" height="150" key={index} src={__dirname + gi.filepath}/>
                )
            } else {
                return (
                    <span key={index}>{gi.type}  {gi.filepath}<br/></span>
                )
            }
        });
    }

    return (
        <div className="gallery-container">
            <div className="header">
                <h2>{g.title}</h2>
                <h5>{g.description}</h5>
            </div>
            <hr/>
            <div className="gallery-items-container">
                <MyDropzone/>
                <SRLWrapper>
                    {galleryItemsDisplay}
                </SRLWrapper>
            </div>
        </div>
    )
}

export default GalleriesTable;