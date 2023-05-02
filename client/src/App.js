import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
//import io from 'socket.io-client';
import Cookies from 'js-cookie';

import NotLoggedPage from './components/notLoggedPage';
import HomePage from './components/HomePage';
import Logout from './components/Logout';

//const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:4000';
//const socket = socketIO.connect(SOCKET_SERVER_URL);
const socket = socketIO.connect('http://127.0.0.1:4000');

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