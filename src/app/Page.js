import { useEffect, useState } from "react";


function Page(props){
    
    const [ page, setPage ] = useState();
    console.log(page);
    useEffect(() => {
        fetch('/db/pages/'+props.path).then(res => res.text()).then(res => {
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
            {titleDisplay}
        </div>
    )
}

export default Page;