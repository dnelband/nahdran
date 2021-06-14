import { useEffect, useState } from "react";
import Content from "./partials/Content";
import "./style/page.css";

// #1 in a useEffect method (with no vars in the second argument), fetch the page we need using the props.path variable,
//    with this url `/db/pages/${props.path}`
// #2 parse the result to JSON (JSON.parse(result)[0], we use the [0] because the result is an array with a single object),
//    then assign it to a state variable called "page" ( const [ page, setPage ] = useState();)
// #3 use the paramater page.background_image to set the background image style property of the main <div></div> container
//    HINT: create a pageStyle = {backgroundImage:`url(${page.background_image})`} object, and pass it to the main div using the style={pageStyle} tag
// #4 create an inner container div to contain the content, since we dont want the content of the page (text, gallery etc)
//    to strech the whole width of a page in wide screens ( use the "ui container" css class provided by semantic ui, which we use in this project)
// #5 in a useEffect method, fetch the contents of the page using the page.page_id property ( can only be done once the state variable "page" is defined)
//    with the url `/db/contentsbypage/${page.page_id}`
// #6 parse the result to JSON (JSON.parse(result)), the assign it to a new state variable called "contents" , assume it to be an array!
//    even though most pages will just have one "contents" item, we still need to account for the posibility of multiple "contents" per page
// #7 render the contents using the map function - contents.map((ct,index) =>(<div>code...</div>))
//    at first just render out the ct.type and the ct.value
// #8 create different components for each content type -> HomePage, Gallery, ContactForm, News, Crew, HTML
// EXAMPLE FOR STEPS 1 - 4 AT BOTTOM OF THE PAGE

function Page(props) {
  const [page, setPage] = useState();
  const [content, setContent] = useState();
  useEffect(() => {
    getPage();
  }, []);

  useEffect(() => {
    if (page) getContent();
  }, [page]);

  function getPage() {
    fetch(`/db/pages/${props.path}`)
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res)[0];
        setPage(result);
      });
  }

  function getContent() {
    fetch(`/db/contentsbypage/${page.page_id}`)
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res);
        setContent(result);
      });
  }

  let titleDisplay;
  let containerStyle;
  if (page) {
    titleDisplay = page.title;
    containerStyle = {
      backgroundImage: `url(${page.background_image})`,
    };
  }

  let contentDisplay;
  if (content) {
    contentDisplay = content.map((ct, i) => (
      <Content key={i} ct={ct}></Content>
    ));
  }

  return (
    <div className="page" style={containerStyle}>
      <div className="content-container">
        <div className="content-display">{contentDisplay}</div>
      </div>
    </div>
  );
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
