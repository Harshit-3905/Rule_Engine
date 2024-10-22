import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
                    <Link to="/" className="hover:text-blue-200 transition-colors duration-300">
                        Rule Engine
                    </Link>
                </h1>
                <nav className="w-full sm:w-auto">
                    <ul className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
                        <li><NavLink to="/">Create Rule</NavLink></li>
                        <li><NavLink to="/combine">Combine Rules</NavLink></li>
                        <li><NavLink to="/check">Check Eligibility</NavLink></li>
                        <li><NavLink to="/view">View Rule</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
        to={to}
        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors duration-300"
    >
        {children}
    </Link>
)

export default Header
