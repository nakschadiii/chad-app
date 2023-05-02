import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const LoginForm = ({ socket }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    socket.on('loginVerified', (data) => {
        data = JSON.parse(data);
        if (data[0]) {
            Cookies.set('8bb052b406ffac0b420918a77c905b0c_user', data[1], { expires: 1000 });
            window.location.reload();
        }else{
            setShowDiv(true);
        }
    });
    return () => { socket.off("loginVerified"); };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    socket.emit('login', { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {showDiv && (
        <div style={{ color: 'red' }}>Combinaison non reconnue</div>
      )}
      <div>
        <label htmlFor="username">Nom d'utilisateur:</label>
        <input type="text" name="login_username" id="login_username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input type="password" name="login_password" id="login_password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;