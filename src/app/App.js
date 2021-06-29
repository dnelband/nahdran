import { useState, useEffect, Suspense, lazy } from 'react';
import Page from './Page';
import Header from './partials/Header';

import 'semantic-ui-css/semantic.min.css';
import './style/app.css';

const UserSignin = lazy(() => import('./partials/Signin'));
const Admin = lazy(() => import('./admin/Admin'));

function App() {
  // get the part of the url after the domain name, or in our case after the "localhost:XXXX" but before whatever comes after another "/"
  let path = window.location.pathname.split('/')[1];
  // use that path to determine which content we display
  let pageDisplay,
    headerDisplay = <Header path={path}/>;
  switch (path) {
    case '':
      pageDisplay = <Page path={'home'} />;
      break;
    case 'signin':
      pageDisplay = (
        <Suspense fallback="Loading Signin">
          <UserSignin />
        </Suspense>
      );
      break;
    case 'admin':
      headerDisplay = null;
      pageDisplay = (
        <Suspense fallback="Loading Admin">
          <Admin />
        </Suspense>
      );
      break;
    default:
      pageDisplay = <Page path={path} />;
      break;
  }

  return (
    <div className="App">
      {headerDisplay}
      <main>{pageDisplay}</main>
    </div>
  );
}

export default App;
