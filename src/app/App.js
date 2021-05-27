import { useState, useEffect, Suspense, lazy } from 'react';
import Page from './Page';

import 'semantic-ui-css/semantic.min.css'
import './style/style.css';

const UserSignin = lazy(() => import('./partials/Signin'));
const Admin = lazy(() => import('./admin/Admin'));

function App() {
  // get the part of the url after the domain name, or in our case after the "localhost:XXXX" but before whatever comes after another "/"
  let path = window.location.pathname.split('/')[1];
  // use that path to determine which content we display
  let pageDisplay, headerDisplay = <Header/>;
  switch (path) {
    case "":
      pageDisplay = <Page path={"home"}/>
      break;
    case "signin":
      pageDisplay = (
        <Suspense fallback="Loading Signin">
          <UserSignin/>
        </Suspense>
      )
      break;
    case "admin":
      headerDisplay = null;
      pageDisplay = (
        <Suspense fallback="Loading Admin">
          <Admin/>
        </Suspense>
      )
      break;
    default:
        pageDisplay = <Page path={path}/>
      break;
  }
  
  return (
    <div className="App">
      {headerDisplay}
      <main>
        {pageDisplay}
      </main>
    </div>
  );
}

function Header(){
  
  // state vars
  const [ menuItems, setMenuItems ] = useState();

  // console.log menuItems to visiualize it
  console.log(menuItems);

  // will fire once on initialization
  useEffect(() => {
    getMenuItems();
  },[])

  function getMenuItems(){
    // fetch all items from the db table "pages" which we will use for the top menu
    fetch('/db/pages').then(res => res.text()).then(res => {
      // in order to use the data we get from the server we need to parse it to JSON - JSON.parse(res)
      setMenuItems(JSON.parse(res));
    });
  }

  // menu items display logic - wait for the state var  menuItems to be defined, then render menuItems 
  // we do this to avoid errors when we try to render menuItems while its undefined
  let menuItemsDisplay;
  if (menuItems){
      menuItemsDisplay = menuItems.map((mi,index) => (
        // mi - represnts every item in the "menuItems" array
          <a href={"/"+mi.link}><b>{mi.title}</b></a>
      ))
  }

  return (
      <header>
        <div className="ui container topmenu">
          {menuItemsDisplay}
        </div>
      </header>
  )
}

export default App;
