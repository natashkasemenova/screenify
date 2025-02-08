import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png'; 

function Navbar() {
    const [nav, setNav] = useState(false);

    useEffect(() => {
        const changeBackground = () => {
            setNav(window.scrollY >= 50);
        };

        window.addEventListener('scroll', changeBackground);
        return () => window.removeEventListener('scroll', changeBackground);
    }, []);

    return (
        <nav className={nav ? "nav active" : "nav"}>
            <div className={`nav-logo ${nav ? "show" : ""}`}>
                <img src={logo} alt="Logo" />
                <span>screenify</span>
            </div>
        </nav>
    );
}

export default Navbar;