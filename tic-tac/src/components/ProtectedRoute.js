import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = (props) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    const user = sessionStorage.getItem("userSession");
    if (user) {
      setIsUserAuthenticated(true);
    }
  }, []);

  const login = () => {
    navigate(`/login`);
  };

  if (!isUserAuthenticated) {
    return (
      <div>
        <h2>Please login to proceed </h2>
        <input type="button" value="Login" onClick={login}></input>
      </div>
    );
  } else return props.children;
};

export default ProtectedRoute;
