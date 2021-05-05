import { useState } from 'react';
import GalleriesTable from './GalleriesTable';
import PagesTable from './PagesTable';
import Form from './Form';

function Admin(){

    const [ section, setSection ] = useState('')

    let adminPath = window.location.pathname.split('/admin/')[1];
    if (adminPath && adminPath.indexOf('/') > -1) adminPath = adminPath.split('/')[0];
    let adminSectionDisplay;
    console.log(adminPath);
    switch (adminPath) {
        case "pages":
            adminSectionDisplay = <PagesTable/>
            break;
        case "galleries":
            adminSectionDisplay = <GalleriesTable/>
            break;
        case "create":
            adminSectionDisplay = <Form type="create"/>
            break;
        case "edit":
            adminSectionDisplay = <Form type="edit"/>
            break;
        default:
            adminSectionDisplay = <p>here will be dat admin yo!</p>
            break;
    }

    return (
        <div className="page">
        <section className="ui container" id="admin">
            <h1>Admin</h1>
            <div className="ui secondary pointing menu">
                <a className={"item " + (!adminPath ? "active" : "")} href="/admin">Main</a>
                <a className={"item "  + (adminPath === "pages" ? "active" : "")} href="/admin/pages">Pages</a>
                <a className={"item "  + (adminPath === "galleries" ? "active" : "")} href="/admin/galleries">Galleries</a>
            </div>
            {adminSectionDisplay}
        </section>
        </div>
    )
}

export default Admin;