import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

function MyBookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const normalized = storedBookings.map((booking) => {
      // Support both our internal format and the Cypress fixture format
      if (booking.hospitalName) {
        return booking
      }

      const legacyName = booking['Hospital Name']
      if (legacyName) {
        return {
          id: booking.id || Date.now(),
          hospitalName: legacyName,
          address: booking.address || booking.Address || '',
          city: booking.city || booking.City || '',
          state: booking.state || booking.State || '',
          zipCode: booking.zipCode || booking['ZIP Code'] || '',
          rating: booking.rating || booking['Hospital overall rating'],
          date: booking.date || booking.bookingDate || '',
          time: booking.time || booking.bookingTime || '',
          timeOfDay: booking.timeOfDay || '',
        }
      }

      return booking
    })
    setBookings(normalized)
  }

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.filter((booking) => booking.id !== bookingId)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      setBookings(updatedBookings)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your medical center appointments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No bookings found.</p>
            <p className="text-gray-500 text-sm">Start by searching for medical centers and booking an appointment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏥</span>
                  </div>
                  {booking.rating && (
                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {booking.rating}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {booking.hospitalName}
                </h3>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-start space-x-3">
                    <span className="text-gray-400 mt-0.5">📍</span>
                    <p className="text-sm flex-1">
                      <span className="font-semibold text-gray-700">Address: </span>
                      {booking.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🏙️</span>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">City: </span>
                      {booking.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🗺️</span>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">State: </span>
                      {booking.state}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">📮</span>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">ZIP: </span>
                      {booking.zipCode}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 mt-3 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">📅</span>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Date: </span>
                        {formatDate(booking.date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🕐</span>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Time: </span>
                        {booking.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🌅</span>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Time of Day: </span>
                        {booking.timeOfDay}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
