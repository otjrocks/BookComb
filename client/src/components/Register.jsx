import Navbar from "./Navbar"
import Footer from "./Footer"
import { useState } from "react"
import Alert from "./Alert"
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({username: "", email: "", password: ""})
    const [hasError, setHasError] = useState(false)
    const [response, setResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();
    const redirectAccount = () => {
        navigate("/account");
    }

    async function handleRegister(event) {
        event.preventDefault()
        setIsLoading(true)
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: "include"
        });
        fetch(request)
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(res)
                if (!res.success) {
                    setResponse(res.message)
                    setHasError(true)
                } else {
                    setHasError(false)
                    redirectAccount()
                }
                setIsLoading(false)
            })
            .catch (function (error) {
                setHasError(true)
                setResponse("Server Error, Please try again.")
                console.log('Request failed: ', error);
                setIsLoading(false)
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
                                Create an account
                            </h1>
                            <form onSubmit={handleRegister} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium">Your username</label>
                                    <input type="text" name="username" id="username" onChange={handleFormData} value={formData.username} autoComplete="username" className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="johndoe" required></input>
                                    <div className="label">
                                        <span className="label-text-alt">Username cannot contain any spaces or special characters</span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                                    <input type="email" name="email" id="email" onChange={handleFormData} value={formData.email} autoComplete="email" className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="john@company.com" required></input>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                                    <input type="password" name="password" id="password" onChange={handleFormData} value={formData.password} autoComplete="current-password" placeholder="••••••••" className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required></input>
                                </div>
                                {
                                hasError && <Alert text={response} />
                                }
                                <button type="submit" className="w-full bg-primary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-70" disabled={isLoading}>
                                    { isLoading
                                    ?
                                    <span className="loading loading-dots loading-md"></span>
                                    :
                                    <>Create Account</>
                                    }
                                </button>
                                <button className="text-sm font-light">
                                    Already have an account? <a href="/login" className="font-medium hover:underline">Log In</a>
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