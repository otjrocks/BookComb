import Logo from "./Logo"
import { Analytics } from "@vercel/analytics/react"

export default function Footer() {
    return (
    <footer className="footer footer-center bg-primary text-primary-content p-10">
        <aside>
            <div className="w-36">
                <Logo />
            </div>
            <p className="font-bold text-2xl">
            {import.meta.env.VITE_SITE_NAME}
            <br />
            </p>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            <p><a className="link" href="/about">Credit</a></p>
        </aside>
        <Analytics />
    </footer>
    )
}