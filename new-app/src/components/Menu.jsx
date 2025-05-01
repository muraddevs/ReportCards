import React from "react";
import { useNavigate } from "react-router-dom";
import "../designs/Menu.css";

const Menu = () => {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate("/home");
    };

    const navigateToAuthPage = () => {
        navigate("/auth");
    };

    return (
        <div className="menu-container">
            <div className="menu-buttons">
                <button className="menu-button" onClick={navigateToHomePage}>
                    Yeni Form daxil edin
                </button>
                <button className="menu-button" onClick={navigateToAuthPage}>
                    Məlumatlara keçid edin
                </button>
            </div>
        </div>
    );
};

export default Menu;
