import { useState, useEffect, Suspense, lazy } from 'react';
import Page from './Page';

import 'semantic-ui-css/semantic.min.css'
import './style/style.css';

const UserSignin = lazy(() => import('./partials/Signin'));
const Admin = lazy(() => import('./admin/Admin'));

function App() {

  let path = window.location.pathname.split('/')[1]
  let pageDisplay, headerDisplay = <Header/>;
  switch (path) {
    case "":
      pageDisplay = <Page path={"homepage"}/>
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
  
  const [ menuItems, setMenuItems ] = useState();

  useEffect(() => {
      fetch('/db/pages').then(res => res.text()).then(res => {
          setMenuItems(JSON.parse(res));
      });
  },[])

  let menuItemsDisplay;
  if (menuItems){
      menuItemsDisplay = menuItems.map((mi,index) => (
          <a href={"/"+mi.link}><b> - {mi.title} - </b></a>
      ))
  }

  return (
      <header>
        <div className="ui container">
        {menuItemsDisplay}
        </div>
      </header>
  )
}

export default App;
