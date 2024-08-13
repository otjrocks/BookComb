import Navbar from "./Navbar"
import Footer from "./Footer"
import Alert from "./Alert";
import { useState } from "react"
import { useParams } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams();
    const [formData, setFormData] = useState({email: ""})
    const [hasAlert, setHasAlert] = useState(false)
    const [response, setResponse] = useState("")


    function handleResetPassword(event) {
        event.preventDefault()
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/reset/${token}`, {
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
                setResponse('Password reset successful. Redirect to login to use new password.')
                setHasAlert(true)
            })
            .catch (function (error) {
                setHasAlert(true)
                setResponse(res.message)
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
                                Reset Password
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                                    <input type="password" name="password" id="password" onChange={handleFormData} value={formData.password} placeholder="••••••••" className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Confirm Password</label>
                                    <input type="password" name="confirm" id="confirm" onChange={handleFormData} value={formData.confirm} placeholder="••••••••" className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                </div>
                                <button type="button" onClick={handleResetPassword} className="w-full bg-primary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Reset Password</button>
                                <div>
                                    <a href="/login" className="font-medium hover:underline">Log In</a>
                                </div>
                            </div>
                            {
                                hasAlert && <Alert text={response} />
                            }
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}