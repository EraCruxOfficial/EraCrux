import { AlignCenter } from "lucide-react";
import React, { useState, useEffect } from "react";

const navStyles = {
    navcontainer: {
        // background: "#111",
        // color: "#fff",
        padding: "1rem",
        // position: "relative",
    },
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    logo: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        letterSpacing: "2px",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    links: {
        display: "flex",
        gap: "1.5rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "1rem",
        transition: "color 0.2s",
        cursor: "pointer",
    },
    hamburger: {
        display: "none",
        flexDirection: "column",
        cursor: "pointer",
        gap: "5px",
    },
    bar: {
        width: "25px",
        height: "3px",
        background: "#fff",
        borderRadius: "2px",
    },
    mobileMenu: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "#222",
        position: "absolute",
        top: "60px",
        right: "1rem",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    },
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenuOpen(false); // close menu if switching to desktop
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinks = [
        { name: "Home", href: "#" },
        { name: "About", href: "#" },
        { name: "Services", href: "#" },
        { name: "Contact", href: "#" },
    ];

    return (
        <div style={navStyles.navcontainer}>
            <nav style={navStyles.nav}>
                <div style={navStyles.logo}>
                    <img src="/pics/eracruxLogo.png" alt="" className="logo"/>
                    EraCrux
                </div>
                {!isMobile && (
                    <ul style={navStyles.links}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} style={navStyles.link}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {isMobile && (
                    <div
                        style={{ ...navStyles.hamburger, display: "flex" }}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <div style={navStyles.bar}></div>
                        <div style={navStyles.bar}></div>
                        <div style={navStyles.bar}></div>
                    </div>
                )}
            </nav>
            {menuOpen && isMobile && (
                <div style={navStyles.mobileMenu}>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            style={navStyles.link}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Navbar;
