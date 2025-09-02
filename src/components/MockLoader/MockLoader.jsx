import { useEffect } from "react";
import "./MockLoader.css";

function MockLoader(props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.setIsLoading(false);
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container">
      <i className="fa fa-spinner w3-spin loader"></i>
    </div>
  );
}

export default MockLoader;
