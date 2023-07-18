import './App.css';
import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./components/LandingPage/LandingPage";
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ProblemPage from './components/ProblemPage/ProblemPage';
import Navbarfunc from './components/Navbar/Navbar';
import UserProfile from './components/UserPage/UserPage';
import Submissions from './components/Submissions/Submissions';


function App() {
  return (
    <>
    <BrowserRouter>
        <Navbarfunc />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/ProblemPage/:pid" element={<ProblemPage />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/Submissions" element={<Submissions />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React tom
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;