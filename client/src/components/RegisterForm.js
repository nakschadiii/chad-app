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