import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const [medicalCenters, setMedicalCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (state && city) {
      fetchMedicalCenters(state, city)
    }
  }, [state, city])

  const fetchMedicalCenters = async (stateName, cityName) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://meddata-backend.onrender.com/data?state=${encodeURIComponent(stateName)}&city=${encodeURIComponent(cityName)}`
      )
      const data = await response.json()
      setMedicalCenters(data)
    } catch (error) {
      console.error('Error fetching medical centers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (index) => {
    const hospital = medicalCenters[index]
    navigate(`/booking/${index}?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&hospitalName=${encodeURIComponent(hospital['Hospital Name'])}&address=${encodeURIComponent(hospital.Address)}&cityName=${encodeURIComponent(hospital.City)}&stateName=${encodeURIComponent(hospital.State)}&zipCode=${encodeURIComponent(hospital['ZIP Code'])}&rating=${hospital['Overall Rating'] || ''}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading medical centers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {medicalCenters.length} medical centers available in {city?.toLowerCase()}
          </h1>
          <p className="text-gray-600">Select a medical center to book your appointment</p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medicalCenters.map((center, index) => (
            <li
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group list-none"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
                {center['Overall Rating'] && (
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {center['Overall Rating']}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {center['Hospital Name']}
              </h3>
              
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-gray-400 mt-0.5">📍</span>
                  <p className="text-sm flex-1">
                    <span className="font-semibold text-gray-700">Address: </span>
                    {center.Address}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">🏙️</span>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700">City: </span>
                    {center.City}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">🗺️</span>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700">State: </span>
                    {center.State}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">📮</span>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700">ZIP: </span>
                    {center['ZIP Code']}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleBookAppointment(index)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Book FREE Center Visit
              </button>
            </li>
          ))}
        </ul>

        {medicalCenters.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              No medical centers found for the selected location.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please try searching with a different state or city.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
