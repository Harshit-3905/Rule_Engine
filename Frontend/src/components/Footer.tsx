import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
                <p>Developed By
                    <Link to="https://harshitjoshi.me" target="_blank" className="hover:text-blue-300 transition-colors"> Harshit Joshi</Link>
                </p>
            </div>
        </footer>
    )
}

export default Footer
