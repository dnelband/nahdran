import { useEffect, useState } from "react";
import $ from 'jquery';
import  MyDropzone from '../partials/DropZone';
import { SRLWrapper } from "simple-react-lightbox";

function Form(props){
    
    let itemId, itemType = window.location.pathname.split(props.type + '/')[1];
    if (itemType.indexOf('/') > -1){
        itemId =  itemType.split('/')[1];
        itemType = itemType.split('/')[0];
    }

    let formDisplay;
    if (itemType === "page") formDisplay = <PageForm type={props.type} itemId={itemId} />
    
    return (
        <div id="admin-form" className="ui segment form">
            <h1>{props.type} {itemType}</h1>
            <hr/>
            {formDisplay}
        </div>
    )
}

function PageForm(props) {

    const [ title, setTitle ] = useState('');
    let defLink = title.split('%20').join('_');
    const [ link, setLink ] = useState(defLink);
    const [ backgroundImage, setBackgroundImage ] = useState('');
    const [ showInMenu, setShowInMenu ] = useState('');
    const [ contents, setContents ] = useState([]);
    const [ showContentsForm, setShowContentsForm ] = useState(false);

    useEffect(() => {
        if (props.type === "edit"){
            getPage();
            getContents();
        }
    },[])

    function getPage() {
        fetch('/db/pagesbyid/'+props.itemId).then(res => res.text()).then(res => {
            const page = JSON.parse(res)[0]
            setTitle(page.title);
            setLink(page.link);
            setBackgroundImage(page.background_image)
            setShowInMenu(page.show_in_menu)
        });        
    }

    function getContents() {
        fetch('/db/contentsbypage/'+props.itemId).then(res => res.text()).then(res => {
            setContents(JSON.parse(res));
        });        
    }

    function onSetTitle(val) {
        setTitle(val)
        let newVal = val.split(' ').join('_');
        setLink(newVal)
    }

    function onSetLink(val) {
        let newVal = val.split(' ').join('_');
        setLink(newVal)
    }

    function onSubmitClick() {
        
        const newPage = {
            title,
            link,
            background_image:backgroundImage,
            show_in_menu:showInMenu
        }

        let ajaxMethod = "POST";
        if (props.type === "edit") ajaxMethod = "PUT";
        console.log(props.itemId);
        $.ajax({
            url:"/db/pages/" + (props.type === "edit" ? props.itemId : ""),
            method:ajaxMethod,
            data:newPage
        }).done(function(res) {
            console.log("/admin/edit/page/" + parseInt(props.itemId))
            window.location.href =  props.type === "edit" ? "/admin/edit/page/" + parseInt(props.itemId) : "/admin/pages/"
        })
    }

    let pageContentsDisplay;
    if (props.type === "edit"){
        
        const addContentsButtonDisplay = <button onClick={() => setShowContentsForm(showContentsForm === true ? false : true)}>Add Contents</button>
        
        let contentsFormDisplay;
        if (showContentsForm === true) contentsFormDisplay = <ContentsForm pageId={props.itemId} type={"create"} onCreateItem={props.onCreateItem}/>
        
        let contentsDisplay;
        if (contents && contents.length > 0){
            contentsDisplay = contents.map((ct,index) => (
                <ContentsForm type={"edit"}  pageId={props.itemId} onUpdateItem={props.onUpdateItem} key={index} contents={ct} />
            ))
        } else contentsDisplay = <div>no contents</div>
        
        pageContentsDisplay = (
            <div className="ui segment">
                <h2>Page Contents:</h2>
                <div className="contents-container">
                    {addContentsButtonDisplay}
                    {contentsFormDisplay}
                    {contentsDisplay}
                </div>
            </div>
        )
    }

    return (
        <div className="page-form">
            <div className="ui grid">

                <div className="four wide column">

                    <div className="form-field">
                        <img width="100" height="auto" src={__dirname + backgroundImage}/>
                        <MyDropzone image={backgroundImage} onFinishUpload={setBackgroundImage}/>
                    </div>

                </div>

                <div className="twelve wide column">

                    <div className="form-field">
                        <label>Title</label>
                        <input value={title} onChange={e => onSetTitle(e.target.value)} type="text"/>
                    </div>
                    <div className="form-field">
                        <label>Link</label>
                        <input value={link} onChange={e => onSetLink(e.target.value)} type="text"/>
                    </div>

                    <div className="form-field">
                        <label>Show In Menu:</label>
                        <input
                            type="radio"
                            value={1}
                            checked={showInMenu === 1 ? true : false}
                            onChange={e => setShowInMenu(1)}
                        />
                        <label>yes</label>
                        <input
                            type="radio"
                            value={0}
                            checked={showInMenu === 0 ? true : false}
                            onChange={e => setShowInMenu(0)}
                        />
                        <label>no</label>
                    </div>

                </div>

            </div>
            <button onClick={onSubmitClick} className="ui primary button"> {props.type === "edit" ? "update" : "create"}    </button>
            <hr/>
            {pageContentsDisplay}
        </div>
    )
}

function ContentsForm(props){

    const ct = props.contents;
    const contentTypes = ["gallery","html","news","crew","contact","homepage"];
    const [ contentType, setContentType ] = useState(ct ? ct.type : "");
    const [ val, setVal ] = useState(ct ? ct.value : "");

    useEffect(() => {
        if (contentType === "homepage") setVal(0);
    },[contentType])

    function onSubmitClick(id) {
        let value = val;
        if (Number(id)) value = id;
        const newContent = {
            page_id:ct ? ct.page_id : props.pageId,
            type:contentType,
            value:value,
        }
        console.log(newContent);
        let ajaxMethod = "POST";
        if (props.type === "edit") ajaxMethod = "PUT";
        $.ajax({
            url:"/db/contents/" + (props.type === "edit" ? ct.content_id : ""),
            method:ajaxMethod,
            data:newContent
        }).done(function(res) {
            window.location.href = "/admin/edit/page/" + (ct ? ct.page_id : props.pageId)
        })
    }

    function deleteContents(){
        $.ajax({
            url:"/db/contents/" + ct.content_id,
            method:"DELETE"
        }).done(function(res) {
            if (ct.type !== "html") deleteItem("galleries",ct.value);
            else window.location.href =  "/admin/edit/page/" + props.pageId;
        })
    }

    function deleteItem(it,id){
        console.log(it,id);
        $.ajax({
            url:"/db/"+it+"/"+id,
            method:"DELETE"
        }).done(function(res) {
            window.location.href =  "/admin/edit/page/" + props.pageId;
        })        
    }

    let contentsDisplay;
    if (contentType === "html") contentsDisplay = <textarea value={val} onChange={e => setVal(e.target.value)}></textarea>
    else if (contentType === "gallery") contentsDisplay = <GalleryForm onCreateGallery={onSubmitClick} type={props.type} pageId={props.pageId} galleryId={ct ? ct.value : null} />

    let submitButtonDisplay;
    if (props.type !== "edit" && contentType !== "gallery"){
        submitButtonDisplay = <button onClick={onSubmitClick}>{props.type} contents</button>
    }

    let contentsHeaderDisplay;
    if (props.type === "create"){
        contentsHeaderDisplay = (
            <select disabled={(ct ? "disable" : "")} value={contentType} onChange={e => setContentType(e.target.value)}>
                <option value="0">select content type</option>
                { contentTypes.map((c,index) => ( <option key={index} value={c}>{c}</option> )) }
            </select>
        )
    } else {
        contentsHeaderDisplay = (
            <div className="ui header">
                <h2>{ct.type}</h2>
                <button onClick={deleteContents}>Delete Content</button>
            </div>
        )
    }

    return (
        <div className="ui raised segment contents-form" style={{backgroundColor:"#efefef"}}>
            {contentsHeaderDisplay}
            <hr/>
            {contentsDisplay}
            <hr/>
            {submitButtonDisplay}
        </div>
    )
}

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
                if (gi.type === "picture") return <GalleryItemForm key={index} galleryItem={gi} onSubmit={getGalleryItems} galleryId={props.galleryId} type={"edit"} />
                else return <span key={index}>{gi.type}  {gi.filepath}<br/></span>
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

function GalleryItemForm(props){
    const gi = props.galleryItem;
    const [ title, setTitle ] = useState(gi ? gi.title : '');
    const [ caption, setCaption ] = useState(gi ? gi.caption : '');
    const [ filepath, setFilePath ] = useState(gi ? gi.filepath : '');

    function onSubmitClick(){
        const newGalleryItem = {
            gallery_id: gi ? gi.gallery_id : props.galleryId,
            title, 
            caption,
            type:'picture',
            filepath
        }
        let ajaxMethod = props.type === "edit" ? "PUT" : "POST";
        console.log(newGalleryItem);
        console.log(ajaxMethod);
        $.ajax({
            url:"/db/galleryitems/" + (props.type === "edit" ? gi.gallery_item_id : ""),
            method:ajaxMethod,
            data:newGalleryItem
        }).done(function(res) {
            props.onSubmit();
        })  
    }

    function deleteGalleryItem(){
        $.ajax({
            url:"/db/galleryitems/" + gi.gallery_item_id,
            method:"DELETE"
        }).done(function(res) {
            props.onSubmit();
        })
    }

    return (
        <div className="ui segment">
            <h4 className="ui header">Gallery Item form</h4>
            <div className="ui grid">
            <div className="gallery-item-form eight wide column">
                <input type="text" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)}/>
                <textarea placeholder="caption..." value={caption} onChange={e => setCaption(e.target.value)}></textarea>
            </div>
            <div className="eight wide column">
                <img width="100%" src={__dirname + filepath}/>
                <MyDropzone image={__dirname + filepath} onFinishUpload={setFilePath}/>
            </div>
            </div>
            <button onClick={onSubmitClick}>{props.type} gallery item</button>
            { gi ? <button onClick={deleteGalleryItem}>delete {gi.type}</button> : ""}
            
        </div>
    )
}

export default Form;