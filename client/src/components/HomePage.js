import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ socket }) => {
    const navigate = useNavigate();

    useEffect(() => {
        
    });

    return (
        <Link type="button" to="/logout">Déconnexion</Link>
    );
};

export default HomePage;