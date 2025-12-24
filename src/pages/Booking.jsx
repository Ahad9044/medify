import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Booking() {
  const { hospitalId } = useParams()
  const [searchParams] = useSearchParams()
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const [hospital, setHospital] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('')
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
      const hospitalData = data[parseInt(hospitalId)]
      if (hospitalData) {
        setHospital(hospitalData)
      }
    } catch (error) {
      console.error('Error fetching medical centers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDateDisplay = (date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  }

  const timeSlots = {
    Morning: ['09:00 AM', '10:00 AM', '11:00 AM'],
    Afternoon: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
    Evening: ['04:00 PM', '05:00 PM', '06:00 PM']
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedTimeOfDay) {
      alert('Please select date, time of day, and time slot')
      return
    }

    if (!hospital) return

    const booking = {
      id: Date.now(),
      hospitalName: hospital['Hospital Name'],
      address: hospital.Address,
      city: hospital.City,
      state: hospital.State,
      zipCode: hospital['ZIP Code'],
      rating: hospital['Overall Rating'],
      date: selectedDate,
      time: selectedTime,
      timeOfDay: selectedTimeOfDay
    }

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    existingBookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(existingBookings))

    navigate('/my-bookings')
  }

  const availableDates = getAvailableDates()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600 font-medium">Hospital not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hospital Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {hospital['Hospital Name']}
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="text-gray-400 mt-1">📍</span>
                  <p><span className="font-semibold text-gray-700">Address: </span>{hospital.Address}</p>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">🏙️</span>
                  <p><span className="font-semibold text-gray-700">City: </span>{hospital.City}</p>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">🗺️</span>
                  <p><span className="font-semibold text-gray-700">State: </span>{hospital.State}</p>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-gray-400">📮</span>
                  <p><span className="font-semibold text-gray-700">ZIP: </span>{hospital['ZIP Code']}</p>
                </li>
                {hospital['Overall Rating'] && (
                  <li className="flex items-center space-x-3">
                    <span className="text-gray-400">⭐</span>
                    <p>
                      <span className="font-semibold text-gray-700">Rating: </span>
                      <span className="text-yellow-500">
                        {'★'.repeat(Math.round(hospital['Overall Rating']))}
                      </span>{' '}
                      ({hospital['Overall Rating']})
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h2>

          {/* Date Selection */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {availableDates.map((date) => {
                const dateStr = formatDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate === dateStr
                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr)
                      setSelectedTime('')
                      setSelectedTimeOfDay('')
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    {isToday && (
                      <p className="text-xs font-semibold text-blue-600 mb-1">Today</p>
                    )}
                    <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {formatDateDisplay(date)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Time</h3>
              <div className="space-y-8">
                {Object.entries(timeSlots).map(([timeOfDay, slots]) => (
                  <div key={timeOfDay}>
                    <p className="text-base font-semibold text-gray-800 mb-4">{timeOfDay}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {slots.map((slot) => {
                        const isSelected = selectedTime === slot && selectedTimeOfDay === timeOfDay
                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedTime(slot)
                              setSelectedTimeOfDay(timeOfDay)
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                              {slot}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  )
}

export default Booking
