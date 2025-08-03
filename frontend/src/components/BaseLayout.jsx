// src/components/BaseLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import "../index.css";
import styled from 'styled-components';

const BaseLayout = ({ children }) => {
    const StyledUl = styled.ul`
  z-index: 999999999999 !important;
`;
    return (
        <div className="flex items-center justify-center w-full h-full overflow-hidden">
            <div className="max-w-[1440px] bg-white">


                <header className="md:px-5  ">
                    <div className="flex flex-col items-center justify-center ">
                        <img src={Logo} alt="images" className="md:w-[143px] md:h-[177.99px]   w-[100px] h-[100px]" />
                        <ul className="flex md:items-start items-center md:justify-start justify-center mt-10 ">
                            <li className="flex items-center space-x-2 md:space-x-4 lg:space-x-5">
                                <a href="/" className="link">Home</a>
                                <a href="/blog" className="link">Blog</a>
                                <a href="/nutration" className="link">Nutritions</a>
                                <a href="/account" className="link">Account</a>
                            </li>
                        </ul>
                    </div>
                </header>
                <main className="flex-1 mt-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;
