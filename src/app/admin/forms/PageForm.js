import React, {useState, useEffect} from 'react';
import $ from 'jquery';
import MyDropzone from '../../partials/DropZone';
import ContentsForm from './ContentsForm';

function PageForm(props) {

    const [ title, setTitle ] = useState('');
    let defLink = title.split('%20').join('_');
    const [ link, setLink ] = useState(defLink);
    const [ backgroundImage, setBackgroundImage ] = useState('');
    const [ showInMenu, setShowInMenu ] = useState(1);
    const [ order, setOrder ] = useState(0);
    const [ contents, setContents ] = useState([]);
    const [ showContentsForm, setShowContentsForm ] = useState(false);
    const [ error, setError ] = useState('');

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
            setBackgroundImage(page.background_image);
            setShowInMenu(page.show_in_menu);
            setOrder(page.ord);
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

    function onSetBackgroundImage(data){
        setBackgroundImage(data.path);
    }

    function onSubmitClick() {
        setError('');
        const newPage = {
            title,
            link,
            background_image:backgroundImage,
            show_in_menu:showInMenu,
            ord:order
        }
        console.log(newPage);

        let ajaxMethod = "POST";
        if (props.type === "edit") ajaxMethod = "PUT";
        
        $.ajax({
            url:"/db/pages/" + (props.type === "edit" ? props.itemId : ""),
            method:ajaxMethod,
            data:newPage
        }).done(function(res) {
            if (res.message) window.location.href =  props.type === "edit" ? "/admin/edit/page/" + parseInt(props.itemId) : "/admin/pages/"
            else setError('Page title must be unique!')
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
                        <MyDropzone image={backgroundImage} onFinishUpload={onSetBackgroundImage}/>
                    </div>

                </div>

                <div className="twelve wide column">

                    <div className="form-field">
                        <label>Title</label>
                        <input value={title} onChange={e => onSetTitle(e.target.value)} type="text"/>
                    </div>
                    {error}
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
                    <div className="form-field">
                        <label>Order ( 0 = last )</label>
                        <input min="0" value={order} onChange={e => setOrder(e.target.value)} type="number"/>
                    </div>
                </div>

            </div>
            <button onClick={onSubmitClick} className="ui primary button"> {props.type === "edit" ? "update" : "create"}    </button>
            <hr/>
            {pageContentsDisplay}
        </div>
    )
}

export default PageForm;