import "./App.css";
import VerbList from "./verb/index";
import { Route, Routes } from "react-router-dom";
import Home from "./home/index";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AddQuestion from "./question-bank/index";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        {/* <Route path="/grid/:verbId" element={<Home />} /> */}
        <Route
          exact
          path="/grid/:verbId"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/verb"
          element={
            <ProtectedRoute>
              <VerbList />
            </ProtectedRoute>
          }
        />
        <Route exact path="/add-question" element={<AddQuestion />} />
        <Route exact path="/update-question/:id" element={<AddQuestion />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
