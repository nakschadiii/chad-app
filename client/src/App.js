import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Cookies from 'js-cookie';

import NotLoggedPage from './components/notLoggedPage';
import HomePage from './components/HomePage';
import Logout from './components/Logout';

const hostCur = window.location.hostname;
const socket = socketIO.connect(`http://${hostCur}:4000/`);
//const socket = io('http://localhost/api/');

function App() {
  const notLogged = Cookies.get('8bb052b406ffac0b420918a77c905b0c_user') === undefined | null;
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={!notLogged ? <HomePage /> : <NotLoggedPage socket={socket} />} />
          {!notLogged && <Route path="/logout" element=<Logout /> />}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;