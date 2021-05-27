import React from 'react';

import PagesTable from './PagesTable';
import NewsTable from './NewsTable';
import CrewTable from './CrewTable';
import MessagesTable from './MessagesTables';

function Table(props){

    let adminTableDisplay;
    switch (props.type) {
        case "news":
            adminTableDisplay = <NewsTable/>
            break;
        case "crew":
            adminTableDisplay = <CrewTable/>
            break;
        case "messages":
            adminTableDisplay = <MessagesTable/>
            break;
        default:
            adminTableDisplay = <PagesTable/>
            break;
    }

    return (
        <div className="admin-table-container">
            {adminTableDisplay}
        </div>
    )
}

export default Table;