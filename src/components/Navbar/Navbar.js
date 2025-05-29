import { useEffect, useState } from "react";
import "./Navbar.css";
import { useMyList } from "../../hooks/useMyList";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { myListCount } = useMyList();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`nav ${show ? "nav__black" : ""}`}>
      <img className="nav__logo" src="./netflix-logo.png" alt="netflix-logo" />

      <div className="nav__center">
        <span className="nav__mylist-counter">My List ({myListCount})</span>
      </div>

      <img
        className="nav__avatar"
        src="./netflix-avatar.png"
        alt="netflix-avatar"
      />
    </div>
  );
};

export default Navbar;
