import React, { useState, useEffect } from 'react';
import './../style/header.css';

// import { getPages } from '../../../server/controllers/pagesController';

function Header(props) {
  const [menuItems, setMenuItems] = useState();
  const [isMenuIcon, setIsMenuIcon] = useState(
    window.innerWidth <= 820 ? true : false
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    getPages();
    window.addEventListener('resize', onWindowResize);
  }, []);

  function getPages() {
    fetch('/db/pages')
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setMenuItems(result);
      });
  }

  function onWindowResize() {
    setIsMenuIcon(window.innerWidth <= 820 ? true : false);
  }

  let menuItemsDisplay = 'no menu items';
  // if the link i have on a is ewual to the url then it should be active
  // to make sure the statevar is true when small window and false on big window

  if (menuItems) {
    menuItemsDisplay = menuItems.map((mi, i) => (
      <a
        key={i}
        href={mi.link}
        className={mi.link === props.path ? ' active' : ' '}
      >
        {mi.title}
      </a>
    ));
  }

  let headerTemplateDisplay = (
    <React.Fragment>
      <a
        className="mobile-menu"
        onClick={() =>
          setShowMobileMenu(showMobileMenu === true ? false : true)
        }
      >
        <svg
          className="menu-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="bi bi-list"
          viewBox="0 0 16 10"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </a>
      {showMobileMenu === true ? (
        <div className="menu-container">
          <div className="menu">{menuItemsDisplay}</div>
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );

  if (isMenuIcon === false) {
    headerTemplateDisplay = <div className="menu">{menuItemsDisplay}</div>;
  }

  return <header>{headerTemplateDisplay}</header>;
}

export default Header;
