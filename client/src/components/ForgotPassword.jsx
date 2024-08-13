import Navbar from "./Navbar"
import Footer from "./Footer"
import Alert from "./Alert";
import { useState } from "react"

export default function ForgotPassword() {
    const [formData, setFormData] = useState({email: ""})
    const [hasError, setHasError] = useState(false)
    const [response, setResponse] = useState("")


    function handleForgotPassword(event) {
        event.preventDefault()
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/forgot`, {
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
                    setResponse("Check your email for a password reset link.")
                    setHasError(true)
                }
            })
            .catch (function (error) {
                setHasError(true)
                setResponse("Server Error, Please try again.")
                console.log('Request failed: ', error);
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
                                Forgot Password
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <p>Enter the email associated with your account to reset the password.</p>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                                    <input type="email" name="email" id="email" onChange={handleFormData} value={formData.email} className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="john@company.com" required />
                                </div>
                                <button type="button" onClick={handleForgotPassword} className="w-full bg-primary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Reset Password</button>
                            </div>
                            {
                                hasError && <Alert text={response} />
                            }
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}