import React, {useState, useEffect } from 'react';
import $ from 'jquery';
import GalleryForm from './GalleryForm';
import NewsTable from "../tables/NewsTable";
import TextEditor from '../../partials/TextEditor';

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
            if (ct.type === "galleries") deleteItem("galleries",ct.value);
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
    if (contentType === "html"){
        contentsDisplay = (
            /*<textarea value={val} onChange={e => setVal(e.target.value)}></textarea>*/
            <TextEditor val={val} onTextEditorUpdate={setVal} />
        )
    }
    else if (contentType === "gallery") contentsDisplay = <GalleryForm onCreateGallery={onSubmitClick} type={props.type} pageId={props.pageId} galleryId={ct ? ct.value : null} />
    else if (contentType === "news") contentsDisplay = <NewsTable />

    let submitButtonDisplay =  <button onClick={onSubmitClick}>{props.type} contents</button>
    if (props.type === "edit" && contentType === "gallery") submitButtonDisplay = null;

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

export default ContentsForm;