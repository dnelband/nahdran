import { useEffect, useState } from "react";

function Gallery(props){

    const [ gallery, setGallery ] = useState();
    const [ galleryItems, setGalleryItems ] = useState();
    const [ currentItem, setCurrentItem ] = useState();

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
    if (galleryItems){
        galleryItemsDisplay = galleryItems.map((gi,index) => {
            if (gi.type === "picture") return <a onClick={() => setCurrentItem(gi)}><img key={index} src={__dirname + gi.thumbnail}/></a>
            else return  <a  onClick={() => setCurrentItem(gi)}><img index={index} src={__dirname + 'vid-icon.png'}/></a>
        })
    }

    let mainItemDisplay;
    if (currentItem){
        if (currentItem.type === "picture") mainItemDisplay = <img width="100%" src={__dirname + currentItem.filepath}/>
        else if (currentItem.type === "video"){
            mainItemDisplay = (
                <video src={__dirname + currentItem.filepath} width="320" height="240" controls>
                    <source src={__dirname + currentItem.filepath} type={'video/'+currentItem.filepath.split('.')[currentItem.filepath.split('.').length - 1]}></source>
                </video>
            )
        }
    }

    return (
        <div className="gallery-container">
            {galleryHeaderDisplay}
            <div className="main-item ui container">
                {mainItemDisplay}
            </div>
            <div className="gallery">
                {galleryItemsDisplay}
            </div>
        </div>
    )
}

export default Gallery;