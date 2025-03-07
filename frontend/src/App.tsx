import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Signin from "./pages/Signin";
import Shared from "./pages/Shared";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/brain/:hash" element={<Shared/>} />
      </Routes>
    </Router>
  );
}

export default App;
