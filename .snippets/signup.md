Frontend :
```js
import React, { useEffect, useState } from 'react';

const RegisterForm = ({ socket }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDiv, setShowDiv] = useState(false);
  const [colorDiv, setColorDiv] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('register', { name, email, password, confirmPassword });
  };

  useEffect(() => {
    socket.on('registerVerified', (data) => {
        data = JSON.parse(data);
        setError(data[1]);
        setShowDiv(true);
        setColorDiv(data[0]);
    });
    return () => { socket.off("loginVerified"); };
  });

  return (
    <form onSubmit={handleSubmit}>
      {showDiv && (
        <div style={ !colorDiv ? { color: 'red' } : { color: 'green' } }>{ error }</div>
      )}
      <div>
        <label htmlFor="name">Nom:</label>
        <input type="text" name="register_name" id="register_name" onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="name">Email:</label>
        <input type="text" name="register_name" id="register_email" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input type="password" name="register_password" id="register_password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
        <input type="password" name="register_confirmPassword" id="register_confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
```

Backend (node.js) :
```js
socket.on('register', (data) => {
    spawn('php', ['app.php', 'register', JSON.stringify(data)]).stdout.on('data', (data) => { if (data.toString() != null) { socket.emit('registerVerified', data.toString()); } });
});
```

Backend (app.php) :
```php
$register = (function($json) use ($pdo, $crypt){
    $combi = array_combine(['key', 'email', 'pass', 'pass_c'], (array)json_decode($json));
    $combi['pass'] = $crypt($combi['pass']);
    $combi['pass_c'] = $crypt($combi['pass_c']);

    if ($combi['pass'] == $combi['pass_c']) {
        $chechkIfUserExists = $pdo->prepare('SELECT id_user FROM users WHERE keyname = :key OR email = :key');
        $chechkIfUserExists->execute([":key" => $combi['key']]);
        $result = $chechkIfUserExists->fetchAll();

        if (empty($result)) {
            try{
                $registerUser = $pdo->prepare('INSERT INTO `users`(`id_user`, `keyname`, `email`, `password`) VALUES (NULL,?,?,?)');
                $registerUser->execute([$combi['key'], $combi['email'], $combi['pass']]);
            } catch(Exception $e) {
                return json_encode([ false, "Erreur, réessayez dans quelques instants" ]);
            }
            return json_encode([ true, "Inscription reussie" ]);
        }else{
            return json_encode([ false, "Votre compte semble déjà exister" ]);
        }
    }else{
        return json_encode([ false, "Les mots de passes ne correspondent pas" ]);
    }
});
```