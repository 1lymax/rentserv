import {BrowserRouter} from "react-router-dom";
import React from "react";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import {Button} from "react-bootstrap";

function App() {
    const [modalShow, setModalShow] = React.useState(false);
  return (
      <BrowserRouter>
          <NavBar/>
          <AppRouter/>
      </BrowserRouter>
  );
}

export default App;
