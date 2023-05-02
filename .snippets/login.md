Frontend :
```js
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const LoginForm = ({ socket }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    socket.on('loginVerified', (data) => {
        data = JSON.parse(data);
        if (data[0]) {
            Cookies.set('8bb052b406ffac0b420918a77c905b0c_user', data[1], { expires: 1000 });
            window.location.reload();
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
      <div>
        <label htmlFor="username">Nom d'utilisateur:</label>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
```

Backend (node.js) :
```js
socket.on('login', (data) => {
    spawn('php', ['app.php', 'login', JSON.stringify(data)]).stdout.on('data', (data) => { if (data.toString() != null) { socket.emit('loginVerified', data.toString()); } });
});
```

Backend (app.php) :
```php
list(, $func, $arg) = $argv;

try{
    $pdo = new PDO('mysql:host=localhost;dbname=cosmo', "root", "");
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    echo "Impossible d'accéder à la base de données : ".$e->getMessage();
    die();
}

$crypt = (function($toHash){
    return strrev(md5(strrev(sha1($toHash))));
});

$login = (function($json) use ($pdo, $crypt){
    $combi = array_combine(['key', 'pass'], (array)json_decode($json));
    $chechkIfUserExists = $pdo->prepare('SELECT id_user FROM users WHERE keyname = ? AND password = ?');
    $chechkIfUserExists->execute([$combi['key'], $crypt($combi['pass'])]);
    $result = $chechkIfUserExists->fetchAll();

    return json_encode([!empty($result), $result[0]['id_user']]);
});

echo $$func($arg);
```