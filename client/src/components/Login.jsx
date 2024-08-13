import Navbar from "./Navbar"
import Footer from "./Footer"
import Alert from "./Alert";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({email: "", password: ""})
    const [hasError, setHasError] = useState(false)
    const [response, setResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();
    const redirectAccount = () => {
        navigate("/account");
    }

    function handleSignIn(event) {
        event.preventDefault();
        setIsLoading(true);
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });
        fetch(request)
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (!res.success) {
                    setResponse(res.message)
                    setHasError(true)
                } else {
                    console.log(res)
                    redirectAccount()
                    setResponse("Log In Successful.")
                    setHasError(false)
                }
                setIsLoading(false);
            })
            .catch (function (error) {
                setHasError(true)
                setResponse("Server Error, Please try again.")
                console.log('Request failed: ', error);
                setIsLoading(false);
            });
    }
    function handleFormData(event) {
        setFormData(prev => {
            return { 
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    return (
        <>
            <Navbar />
            <section>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                                    <input type="email" name="email" id="email" onChange={handleFormData} value={formData.email} autoComplete='email' className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="john@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                                    <input type="password" name="password" id="password" onChange={handleFormData} value={formData.password} placeholder="••••••••" autoComplete='current-password' className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                </div>
                                <div className="flex items-center justify-between">
                                    <a onClick={() => navigate("/forgot")} className="text-sm font-medium hover:underline">Forgot password?</a>
                                </div>
                                {
                                hasError && <Alert text={response} />
                                }
                                <button type="submit" id="signInButton" className="w-full bg-primary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-70" disabled={isLoading}>
                                    {isLoading
                                    ?
                                    <span className="loading loading-dots loading-md"></span>
                                    :
                                    <>Sign in</>
                                    }
                                </button>
                                <button className="text-sm font-light">
                                    Don’t have an account yet? <a href="/register" className="font-medium hover:underline">Sign up</a>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}