import { useEffect } from "react";
import "./Popup.css";

function Popup(props) {
  useEffect(() => {
    let timeLimit;
    if (!props.isError) {
      timeLimit = 1600;
    } else {
      timeLimit = 1400;
    }
    setTimeout(() => {
      props.setError(false);
    }, 500);
    const timer = setTimeout(() => {
      props.setShowPopup({});
    }, timeLimit);
    return () => {
      clearTimeout(timer);
    };
  }, [props.showPopup]);

  return props.showPopup.show ? (
    <div
      className={
        !props.isError ? "popup-container" : "popup-container popup-error"
      }
    >
      <div className="popup">
        <p className="popup-text">{props.text}</p>
      </div>
    </div>
  ) : null;
}

export default Popup;
