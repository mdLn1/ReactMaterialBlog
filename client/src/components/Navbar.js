import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Link, useLocation } from "react-router-dom"
import { iconLinks } from '../AppSettings'
import MainContext from '../contexts/main/mainContext'

const Navbar = () =>
{
    const mainContext = useContext(MainContext)
    const location = useLocation();
    const [isSidenavShowing, toggleSidenav] = useState(false)
    const { user } = mainContext;

    useEffect(() =>
    {
        if (isSidenavShowing)
        {
            document.getElementsByClassName("sidenav")[0].style.width = "0"
            toggleSidenav(false)
        }
    }, [location])
    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" >Home</Link>
                <Link to="/about-me">About Me</Link>
                <Link to="/contact">Contact</Link>
                <i className="fas fa-bars" onClick={() =>
                {
                    if (isSidenavShowing)
                    {
                        document.getElementsByClassName("sidenav")[0].style.width = "0"
                        toggleSidenav(false)
                    } else
                    {
                        document.getElementsByClassName("sidenav")[0].style.width = "100%"
                        toggleSidenav(true)
                    }
                }}></i>
                <div className="sidenav">
                    <Link to="/" >Home</Link>
                    <Link to="/about-me">About Me</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </div>
            <div className="center">{iconLinks?.facebook &&
                <a href={iconLinks.facebook} target="_blank" rel="noopener noreferrer" className="link-icons">
                    <i className="fab fa-facebook" />
                </a>
            }
                {iconLinks?.github &&
                    <a href={iconLinks.github} target="_blank" rel="noopener noreferrer" className="link-icons">
                        <i className="fab fa-github" />
                    </a>
                }
                {iconLinks?.stackoverflow &&
                    <a href={iconLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="link-icons">
                        <i className="fab fa-stack-overflow" />
                    </a>
                }
                {iconLinks?.twitter &&
                    <a href={iconLinks.twitter} target="_blank" rel="noopener noreferrer" className="link-icons">
                        <i className="fab fa-twitter" />
                    </a>
                }
                {iconLinks?.linkedin &&
                    <a href={iconLinks.linkedin} target="_blank" rel="noopener noreferrer" className="link-icons">
                        <i className="fab fa-linkedin" />
                    </a>
                }
                {iconLinks?.youtube &&
                    <a href={iconLinks.youtube} target="_blank" rel="noopener noreferrer" className="link-icons">
                        <i className="fab fa-youtube" />
                    </a>
                }</div>
            <div className="right">
                {user === null ?
                    <Link to="/login">Login</Link> : <Fragment>
                        {user?.username ?
                            <Link to="/profile" id="text-profile-links">{user.username}</Link> :
                            <Link to="/profile" id="text-profile-links">{user.email}</Link>}
                        <a href="/profile" className="link-icons" id="profile-link-icon">
                            <i className="fas fa-user-circle" />
                        </a>
                    </Fragment>}
            </div>
        </div>
    )
}

export default Navbar
