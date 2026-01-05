import {Routes,Route,Navigate} from "react-router-dom";
import Component from "./component";


function App() {
  return (
    <Routes >
         <Route index element={<Navigate to="/components"/>} />
         <Route path="/components/*" element={<Component />} />
    </Routes>
  );
}

export default App;
