import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import Spinner from '../components/Spinner';
import moment from "moment";
import { Link } from "react-router-dom";

function UserBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [userBookings, setUserBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Fetch bookings only if we don't have them
    if (!bookings?.length) {
      dispatch(getAllBookings());
    }
  }, [dispatch, bookings?.length]);

  useEffect(() => {
    // Filter bookings for the current user only when bookings or user changes
    if (bookings && user) {
      console.log("All bookings:", bookings);
      console.log("Current user ID:", user._id);
      const filteredBookings = bookings.filter(booking => {
        console.log("Booking user ID:", booking.user);
        return booking.user._id === user._id;
      });
      console.log("Filtered bookings:", filteredBookings);
      // Only update state if the filtered bookings have changed
      if (JSON.stringify(filteredBookings) !== JSON.stringify(userBookings)) {
        setUserBookings(filteredBookings);
      }
    }
  }, [bookings, user, userBookings]);

  return (
    <DefaultLayout>
      {loading && (<Spinner />)}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-center mb-8">My Bookings</h3>

        {(!userBookings || userBookings.length === 0) ? (
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              No bookings found. Start booking cars now!
            </div>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {userBookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Car Details */}
                    <div>
                      <h4 className="font-bold text-lg mb-2">{booking.car?.vehicles?.[0]?.name || 'Car'}</h4>
                      <img 
                        src={booking.car?.vehicles?.[0]?.image} 
                        alt={booking.car?.vehicles?.[0]?.name || 'Car'}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <p>From: {moment(booking.bookedTimeSlots?.from).format('MMM DD YYYY, HH:mm')}</p>
                        <p>To: {moment(booking.bookedTimeSlots?.to).format('MMM DD YYYY, HH:mm')}</p>
                        <p>Total Hours: {booking.totalHours}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-2">
                      <p className="font-semibold">₹{booking.totalAmount}</p>
                      <p className="text-sm text-gray-500">Transaction ID:</p>
                      <p className="text-xs font-mono">{booking.transactionId}</p>
                      {booking.driverRequired && (
                        <p className="text-sm text-blue-600">Driver Included</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default UserBookings;