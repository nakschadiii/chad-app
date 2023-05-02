import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Logout = ({ socket }) => {
    const navigate = useNavigate();

    Cookies.set('8bb052b406ffac0b420918a77c905b0c_user', null, { expires: -1 });
    //window.location.replace('/logout');

    useEffect(() => {
        setInterval(() => {
            if(Cookies.get('8bb052b406ffac0b420918a77c905b0c_user') == null){
                window.location.replace('/');
            }
        }, 500);
    });
};
  
export default Logout;