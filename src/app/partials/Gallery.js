import { useEffect, useState } from "react";

function Gallery(props){

    const [ gallery, setGallery ] = useState();
    const [ galleryItems, setGalleryItems ] = useState();

    useEffect(() => {
        getGallery();
        getGalleryItems();
    },[])

    function getGallery(){
        fetch(`/db/galleries/${props.galleryId}`).then(res => res.text()).then(res => {
            setGallery(JSON.parse(res)[0])
        })        
    }

    function getGalleryItems(){
        fetch(`/db/galleryitemsbygallery/${props.galleryId}`).then(res => res.text()).then(res => {
            setGalleryItems(JSON.parse(res))
        })        
    }

    let galleryHeaderDisplay;
    console.log(gallery);
    if (gallery){
        galleryHeaderDisplay = (
            <div className="gallery-header">
                <h2>{gallery.title}</h2>
                <p>{gallery.description}</p>
            </div>
        )
    }

    let galleryItemsDisplay;
    console.log(galleryItems);
    if (galleryItems){
        galleryItemsDisplay = galleryItems.map((gi,index) => {
            if (gi.type === "picture") return <a href={gi.filepath}><img key={index} src={__dirname + gi.thumbnail}/></a>
            else return  <a href={gi.filepath}><img index={index} src={__dirname + 'vid-icon.png'}/></a>
        })
    }

    return (
        <div className="gallery-container">
            {galleryHeaderDisplay}
            <div className="gallery">
                {galleryItemsDisplay}
            </div>
        </div>
    )
}

export default Gallery;