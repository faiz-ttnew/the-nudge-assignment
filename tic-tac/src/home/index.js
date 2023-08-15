import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Grid from "./components/Grid";
// components/Grid
import VerbCell from "./components/VerbCell";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Home() {
  const { verbId } = useParams();
  const [verb, setVerb] = useState("");
  const [grid, setGrid] = useState([]);
  const [verbDetail, setVerbDetail] = useState({});
  let navigate = useNavigate();

  const getVerb = async () => {
    let userSession = JSON.parse(sessionStorage.getItem("userSession"));
    userSession = JSON.stringify(userSession);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/verb/${verbId}/${userSession}`
    );

    const result = await res.json();
    setVerb(result.data.title);
    setGrid(result.data.grid);
    setVerbDetail({ verbId: result.data._id });
  };

  useEffect(() => {
    // if (JSON.parse(sessionStorage.getItem("userSession"))) {
      getVerb();
    // } else {
    //   navigate("/");
    // }
  }, []);

  return (
    <>
    <NavBar />
    
      <VerbCell verbTitle={verb} />
      <br />
      <Grid
        questionGrid={grid}
        verbTitle={verb}
        verbDetail={verbDetail}
        getVerb={getVerb}
      />
    </>
  );
}

export default Home;
