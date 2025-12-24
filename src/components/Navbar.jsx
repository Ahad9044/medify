import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Medify
              </span>
            </Link>
            <div className="hidden lg:flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Find Doctors
              </Link>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Hospitals
              </Link>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Medicines
              </Link>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Lab Tests
              </Link>
            </div>
          </div>
          <Link 
            to="/my-bookings" 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
