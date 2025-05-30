import { useEffect, useState } from "react";
import "./Navbar.css";
import { useMyList } from "../../hooks/useMyList";
import DatabasePanel from "../DatabasePanel/DatabasePanel";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [showDatabasePanel, setShowDatabasePanel] = useState(false);
  const { myList } = useMyList();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else setShow(false);
    });

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <>
      <div className={`nav ${show ? "nav__black " : ""}`}>
        <img
          className="nav__logo"
          src="./netflix-logo.png"
          alt="netflix-logo"
        />
        <div className="nav__right">
          <div className="nav__my-list-counter">My List ({myList.length})</div>
          <button
            className="nav__database-btn"
            onClick={() => setShowDatabasePanel(true)}
            title="Database Management"
          >
            🗄️ DB
          </button>
          {/* <img
            className="nav__avatar"
            src="./netflix-avatar.png"
            alt="netflix-avatar"
          /> */}
        </div>
      </div>

      <DatabasePanel
        isOpen={showDatabasePanel}
        onClose={() => setShowDatabasePanel(false)}
      />
    </>
  );
};

export default Navbar;
