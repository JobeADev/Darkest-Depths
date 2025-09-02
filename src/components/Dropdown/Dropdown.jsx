import { useState } from "react";
import { Link } from "@tanstack/react-router";
import "./Dropdown.css";

export default function Dropdown(props) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <ul
      className={
        click
          ? `dropdown-list w3-animate-opacity ${props.props[0].group} clicked`
          : `dropdown-list w3-animate-opacity ${props.props[0].group}`
      }
      onClick={handleClick}
    >
      {props.props.map((i, index) => (
        <li key={index} className="dropdown-item">
          <Link
            className={`dropdown-link ${i.class}`}
            to={i.path}
            onClick={() => setClick(false)}
          >
            {i.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
