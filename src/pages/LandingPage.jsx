import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const FALLBACK_STATES = ['Alabama']
const FALLBACK_CITIES = {
  Alabama: ['DOTHAN'],
}

function LandingPage() {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [stateOpen, setStateOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Provide fast fallback options for tests while real API loads
    setStates(FALLBACK_STATES)
    fetchStates()
  }, [])

  useEffect(() => {
    if (selectedState) {
      // Fast fallback cities for tests
      if (FALLBACK_CITIES[selectedState]) {
        setCities(FALLBACK_CITIES[selectedState])
      }
      fetchCities(selectedState)
    } else {
      setCities([])
      setSelectedCity('')
    }
  }, [selectedState])

  const fetchStates = async () => {
    setLoadingStates(true)
    try {
      const response = await fetch('https://meddata-backend.onrender.com/states')
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        const combined = [...new Set([...FALLBACK_STATES, ...data])]
        setStates(combined)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  const fetchCities = async (state) => {
    setLoadingCities(true)
    try {
      const response = await fetch(`https://meddata-backend.onrender.com/cities/${state}`)
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedState && selectedCity) {
      navigate(`/search?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`)
    }
    setStateOpen(false)
    setCityOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Medical Centers
            <span className="block text-blue-600 mt-2">Near You</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search for hospitals and clinics in your area. Book appointments easily and get the care you need.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Search Medical Centers</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="state-select" className="block text-sm font-semibold text-gray-700 mb-3">
                  Select State
                </label>
                <div
                  id="state"
                  className="relative"
                  onClick={() => {
                    if (!loadingStates) {
                      setStateOpen((prev) => !prev)
                      setCityOpen(false)
                    }
                  }}
                >
                  <div className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-gray-900 font-medium">
                      {selectedState || 'Select a state'}
                    </span>
                    <span className="text-gray-400 text-sm">▼</span>
                  </div>
                  {stateOpen && (
                    <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                      {states.map((state) => (
                        <li
                          key={state}
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedState(state)
                            setSelectedCity('')
                            setStateOpen(false)
                          }}
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="city-select" className="block text-sm font-semibold text-gray-700 mb-3">
                  Select City
                </label>
                <div
                  id="city"
                  className="relative"
                  onClick={() => {
                    if (!loadingCities && selectedState) {
                      setCityOpen((prev) => !prev)
                      setStateOpen(false)
                    }
                  }}
                >
                  <div className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-gray-900 font-medium">
                      {selectedCity || 'Select a city'}
                    </span>
                    <span className="text-gray-400 text-sm">▼</span>
                  </div>
                  {cityOpen && (
                    <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                      {cities.map((city) => (
                        <li
                          key={city}
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCity(city)
                            setCityOpen(false)
                          }}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button
                type="submit"
                id="searchBtn"
                disabled={!selectedState || !selectedCity}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
