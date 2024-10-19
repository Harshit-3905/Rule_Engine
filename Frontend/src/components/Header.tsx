import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Rule Engine</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/" className="hover:text-blue-300 transition-colors">Create Rule</Link></li>
                        <li><Link to="/combine" className="hover:text-blue-300 transition-colors">Combine Rules</Link></li>
                        <li><Link to="/check" className="hover:text-blue-300 transition-colors">Check Eligibility</Link></li>
                        <li><Link to="/view" className="hover:text-blue-300 transition-colors">View Rule</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
