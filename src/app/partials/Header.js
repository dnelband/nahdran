import React, { useState, useEffect } from 'react';
import './../style/header.css';
// import { getPages } from '../../../server/controllers/pagesController';

function Header() {
  const [menuItems, setMenuItems] = useState();

  useEffect(() => {
    getPages();
  }, []);

  function getPages() {
    fetch('/db/pages')
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setMenuItems(result);
      });
  }

  let menuItemsDisplay = 'no menu items';

  if (menuItems) {
    menuItemsDisplay = menuItems.map((mi, i) => (
      <a key={i} href={mi.link}>
        {mi.title}
      </a>
    ));
  }

  return (
    <header>
      <div className="menu">{menuItemsDisplay}</div>
    </header>
  );
}

export default Header;
