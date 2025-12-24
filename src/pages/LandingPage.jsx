import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Navbar from '../components/Navbar'

function LandingPage() {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStates()
  }, [])

  useEffect(() => {
    if (selectedState) {
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
      setStates(data)
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
      setCities(data)
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

        {/* Services Carousel */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Services</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="featured-services pb-12"
          >
            <SwiperSlide>
              <div className="bg-white rounded-xl p-6 h-full shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Doctors</h3>
                <p className="text-gray-600 text-sm">Search and book appointments with qualified doctors</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white rounded-xl p-6 h-full shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🏨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospitals</h3>
                <p className="text-gray-600 text-sm">Discover medical centers in your area</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white rounded-xl p-6 h-full shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">💊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicines</h3>
                <p className="text-gray-600 text-sm">Find pharmacies and medicine availability</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white rounded-xl p-6 h-full shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🧪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lab Tests</h3>
                <p className="text-gray-600 text-sm">Book lab tests and diagnostic services</p>
              </div>
            </SwiperSlide>
          </Swiper>
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
                <div id="state">
                  <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                    disabled={loadingStates}
                  >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="city-select" className="block text-sm font-semibold text-gray-700 mb-3">
                  Select City
                </label>
                <div id="city">
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                    disabled={!selectedState || loadingCities}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
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
