import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
    const [user, setUser] = useState({authenticated: false})

    const navigate = useNavigate();
    const redirectHome = () => {
        navigate("/");
    }
    const redirectBookshelf = () => {
        navigate(`/bookshelf/${user?.username}`)
    }

    function handleLogout() {
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
        });
        fetch(request)
            .then(
                res => res.json()
            ).then(
                () => {
                    setUser({authenticated: false})
                    redirectHome()
                }
            ).catch(
                err => console.log(err)
            )
    }

    useEffect(() => {
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/info`, {
            method: "GET",
            credentials: "include",
        });
        fetch(request)
            .then(
                res => res.json()
            ).then(
                res => setUser(res)
            ).catch(
                err => console.log(err)
            )
    }, [])

    const [isdark, setIsdark] = useState(JSON.parse(localStorage.getItem('isdark')));
    useEffect(() => {
        localStorage.setItem('isdark', JSON.stringify(isdark));
    }, [isdark]);
    
    return (
        <nav>
            <div className="flex flex-wrap lg:flex-none navbar bg-base-100 pl-5">
                <div className="flex-1">
                    <a href="/" className="flex flex-wrap items-center text-2xl font-bold">
                        <div className="w-24">
                            <Logo />
                        </div>
                        <h1 className="pl-2">
                        {import.meta.env.VITE_SITE_NAME}
                        </h1>
                    </a>
                </div>
                <div className="flex-none">
                    <div className="pr-3">
                        <label className="flex cursor-pointer gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <path
                                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                            <input 
                                type="checkbox" 
                                value="dark" // name of theme to switch to
                                className="toggle theme-controller" 
                                checked={isdark}
                                onChange={() => setIsdark(!isdark)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </label>
                    </div>
                    {
                            user?.authenticated ?
                            <a href="/account">My Account</a> :
                            <a href="/login">Log In</a>
                    }
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/account">My Account</a></li>
                            {
                            user?.authenticated && user?.username &&
                            <>
                                <li><a onClick={redirectBookshelf}>Preview Bookshelf</a></li>
                                <li><a onClick={handleLogout}>Log Out</a></li>
                            </>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}