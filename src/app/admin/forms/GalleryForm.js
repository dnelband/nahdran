import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { SRLWrapper } from "simple-react-lightbox";
import GalleryItemForm from './GalleryItemForm';

function GalleryForm(props){
        
    const [ gallery, setGallery ] = useState();
    
    const [ title, setTitle ] = useState(); 
    const [ description, setDescription ] = useState();
    const [ galleryItems, setGalleryItems ] = useState();

    const [ showAddGalelryItemForm, setShowAddGalleryItemForm ] = useState(false);

    useEffect(() => {
        if (props.galleryId) getGallery();
    },[])

    function getGallery(){
        console.log('hello');
        fetch('/db/galleries/'+props.galleryId).then(res => res.text()).then(res => {
            let g = JSON.parse(res)[0];
            setGallery(g);
            setTitle(g.title);
            setDescription(g.description);
            getGalleryItems(g);
        });
    }

    function getGalleryItems(g){
        setShowAddGalleryItemForm(false);
        let gId = gallery ? gallery.gallery_id : g.gallery_id;
        fetch('/db/galleryitemsbygallery/'+gId).then(res => res.text()).then(res => {
            setGalleryItems(JSON.parse(res));
        });
    }

    function onSubmitClick(){
        
        const newGallery = { title, description }
        let ajaxMethod = props.type === "edit" ? "PUT" : "POST";
        $.ajax({
            url:"/db/galleries/" + (props.type === "edit" ? gallery.gallery_id : ""),
            method:ajaxMethod,
            data:newGallery
        }).done(function(res) {
            console.log('res')
            console.log(res);
            if (props.type === "create") props.onCreateGallery(res.id);
            else window.location.href =  "/admin/edit/page/"+props.pageId;
        })

    }

    let galleryDisplay;
    if (props.galleryId){

        let galleryItemsDisplay;
        if (galleryItems){
            galleryItemsDisplay = galleryItems.map((gi,index) => {
                return <GalleryItemForm key={index} galleryItem={gi} onSubmit={getGalleryItems} galleryId={props.galleryId} type={"edit"} />
            });
        }

        let addGalelryItemForm;
        if (showAddGalelryItemForm === true) addGalelryItemForm = <GalleryItemForm onSubmit={getGalleryItems} galleryId={props.galleryId} type={"create"} />

        galleryDisplay = (
            <div className="gallery-items-container">
                <button onClick={() => setShowAddGalleryItemForm(showAddGalelryItemForm === true ? false : true)}>+ add gallery item</button>
                {addGalelryItemForm}
                <SRLWrapper>
                    {galleryItemsDisplay}
                </SRLWrapper>
            </div>
        )
    }

    return (
        <div className="ui raised segment gallery-container">
            <div className="header">
                <input placeholder="Gallery Title..." type="text" onChange={e => setTitle(e.target.value)} value={title}/>
                <textarea placeholder="Gallery Description..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <button onClick={onSubmitClick}>{props.type} gallery</button>
            <hr/>
            {galleryDisplay}
        </div>
    )
}

export default GalleryForm;