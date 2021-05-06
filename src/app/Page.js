import { useEffect, useState } from "react";


function Page(props){
    
    // #1 fetch the page we need using the props.path variable, with this url `/db/pages/${props.path}`
    // #2 parse the result to JSON (JSON.parse(result)), the assign it to a new state variable called "page"
    // #3 use the paramater page.background_image to set the background image style property of the main <div></div> container
    // #4 create an inner container div to hold the content, since we dont want the content of the page (text, gallery etc) 
    //    to strech the whole width of a page in wide screens ( use the "ui container" css class provided by semantic ui, which we use in this project)
    // #5 fetch the contents of the page using the page.page_id property ( can only be done once page is defined) 
    //    with the url `/db/contentsbypage/${page.page_id}`
    // #6 parse the result to JSON (JSON.parse(result)), the assign it to a new state variable called "contents" , assume it to be an array!
    //    even though most pages will just have one "contents" we still need to account for the posibility of multiple "contents" per page
    // #7 render the contents using the map function - contents.map((ct,index) =>(<div>code...</div>))
    //    at first just render out the ct.type and the ct.value
    // #8 create different components for each content type -> HomePage, Gallery, ContactForm, News, CrewMembers, HTML
    // EXAMPLE FOR STEPS 1 - 4 AT BOTTOM OF THE PAGE

    const [ page, setPage ] = useState();
    useEffect(() => {
        fetch(`/db/pages/${props.path}`).then(res => res.text()).then(res => {
            setPage(JSON.parse(res)[0])
        })
    },[]);

    let titleDisplay, 
        pageStyle;
    if (page){
        titleDisplay = <h1>{page.title}</h1>
        pageStyle = {backgroundImage:`url(${page.background_image})`}
    }

    return (
        <div style={pageStyle} className="page">
            <div className="ui container">
                {titleDisplay}
            </div>
        </div>
    )
}

// EXAMPLE FOR STEPS 1 - 4
// const [ page, setPage ] = useState();
// useEffect(() => {
//     fetch(`/db/pages/${props.path}`).then(res => res.text()).then(res => {
//         setPage(JSON.parse(res)[0])
//     })
// },[]);

// let titleDisplay, 
//     pageStyle;
// if (page){
//     titleDisplay = <h1>{page.title}</h1>
//     pageStyle = {backgroundImage:`url(${page.background_image})`}
// }

// return (
//     <div style={pageStyle} className="page">
//         <div className="ui container">
//             {titleDisplay}
//         </div>
//     </div>
// )
// END EXAMPLE

export default Page;