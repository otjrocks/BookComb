import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Bookshelf from "./Bookshelf";

export default function Account() {
    const [user, setUser] = useState({authenticated: false, email: "", username: ""});
    const navigate = useNavigate();
    
    useEffect(() => {
        const redirectLogin = () => {
            navigate("/login");
        }
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/info`, {
            method: "GET",
            credentials: "include",
        });
        fetch(request)
            .then(
                res => res.json()
            ).then(
                res => {
                    setUser(res);
                }
            ).catch(
                err => {
                    console.log(err)
                    redirectLogin()
                }
            )
    }, [])


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
                err => {
                    console.log(err)
                    redirectLogin()
                }
            )
    }

    return (
        <>
        { user?.authenticated &&
            <>
                <Navbar />
                <div className="container mx-auto mt-24 mb-24 justify-center">
                        <div className="p-4 md:p-8">
                            <h1 className="text-primary font-bold text-4xl pb-4">Account Information</h1>
                            <p className="text-xl"><span className="font-bold">Your Email:</span> {user.email}</p>
                            <p className="text-xl"><span className="font-bold">Your Username:</span> {user.username}</p>
                            <br />
                            <a href="/"><button className="btn btn-primary mt-4">Search Books</button></a>
                            <button className="btn btn-active ml-4 mt-4" onClick={handleLogout}>Log Out</button>
                        </div>
                </div>
                <Bookshelf id={user.username} />
                <Footer />
            </>
        }
        </>
    )
}