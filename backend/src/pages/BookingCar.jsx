

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ totalAmount, car, driver, from, to, totalHours, dispatch, history, setPaymentProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);
    
    try {
      const response = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
        }),
      });

      const { clientSecret } = await response.json();

      // For dummy payments, just proceed with success
      if (clientSecret.includes('dummy')) {
        // Simulate successful payment
        const result = {
          paymentIntent: {
            status: "succeeded",
            id: `pi_dummy_${Date.now()}`
          }
        };
        
        const reqObj = {
          user: JSON.parse(localStorage.getItem("user"))._id,
          car: car._id,
          totalHours,
          totalAmount,
          driverRequired: driver,
          bookedTimeSlots: {
            from,
            to,
          },
          transactionId: result.paymentIntent.id,
        };
        
        const bookingResponse = await dispatch(bookCar(reqObj));
        if (bookingResponse) {
          history.push('/userbookings');
        }
      } else {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: JSON.parse(localStorage.getItem("user")).name,
            },
          },
        });

        if (result.error) {
          alert(result.error.message);
          setPaymentProcessing(false);
        } else if (result.paymentIntent.status === "succeeded") {
          const reqObj = {
            user: JSON.parse(localStorage.getItem("user"))._id,
            car: car._id,
            totalHours,
            totalAmount,
            driverRequired: driver,
            bookedTimeSlots: {
              from,
              to,
            },
            transactionId: result.paymentIntent.id,
          };
          const bookingResponse = await dispatch(bookCar(reqObj));
          if (bookingResponse) {
            history.push('/userbookings');
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!process.env.REACT_APP_STRIPE_PUBLIC_KEY && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="text-gray-600">Payment processing in dummy mode</p>
        </div>
      )}
      {process.env.REACT_APP_STRIPE_PUBLIC_KEY && (
        <div className="mb-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      )}
      <button 
        type="submit" 
        className="btn1 bg-blue-500 p-2 mt-4 w-full"
        disabled={process.env.REACT_APP_STRIPE_PUBLIC_KEY ? !stripe : false}
      >
        Pay Now
      </button>
    </form>
  );
};

function BookingCar({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const history = useHistory(); // Using useHistory
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [, setPaymentProcessing] = useState(false);

console.log("Match Object:", match); // Log the entire match object
console.log("Car ID from params:", match.params.carid); // Log the car ID from params
console.log("Cars from Redux state:", cars); // Log the cars from Redux state

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    } else {
      console.log("Searching for car with ID:", match.params.carid);
      const foundCar = cars.find((o) => o._id === match.params.carid);
      if (foundCar) {
        console.log("Found car:", foundCar);
        setcar(foundCar);
      } else {
        console.error("Car not found for ID:", match.params.carid);
        console.log("Available cars:", cars);
      }
    }
  }, [cars, dispatch, match.params.carid]);

  useEffect(() => {
    const baseAmount = totalHours * (car.vehicles?.[0]?.rentPerHour || 0); // Accessing rentPerHour from vehicles array
    setTotalAmount(driver ? baseAmount + (30 * totalHours) : baseAmount);
  }, [driver, totalHours, car.vehicles]);

  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));

    setTotalHours(values[1].diff(values[0], "hours"));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="flex justify-center items-center" style={{ minHeight: "90vh" }}>
        <div className="lg:w-1/2 sm:w-full p-3">
          {car.vehicles && car.vehicles[0]?.image && <img src={car.vehicles[0].image} className="carimg2 bs1 w-full" alt={car.vehicles[0].name || 'Car'} />}
        </div>

        <div className="lg:w-1/2 sm:w-full text-right p-3">
          <div className="border-b border-gray-300 mb-4">
            <h3 className="text-xl">Car Info</h3>
          </div>
          <div className="text-right">
            <p>{(car.vehicles && car.vehicles[0]?.name) || 'Car not found'}</p>
            <p>{(car.vehicles && car.vehicles[0]?.rentPerHour) || 'N/A'} Rent Per hour /-</p>
            <p>Fuel Type : {(car.vehicles && car.vehicles[0]?.fuelType) || 'N/A'}</p>
            <p>Max Persons : {(car.vehicles && car.vehicles[0]?.capacity) || 'N/A'}</p>
          </div>

          <div className="border-b border-gray-300 my-4">
            <h3 className="text-xl">Select Time Slots</h3>
          </div>
          <input
            type="datetime-local"
            className="block w-full mb-2 p-2 border rounded"
            onChange={(e) => selectTimeSlots([moment(e.target.value), moment(to)])}
          />
          <input
            type="datetime-local"
            className="block w-full mb-2 p-2 border rounded"
            onChange={(e) => selectTimeSlots([moment(from), moment(e.target.value)])}
          />
          <button
            className="btn1 mt-2 underline "
            onClick={() => {
              setShowModal(true);
            }}
          >
            See Booked Slots
          </button>
          {from && to && (
            <div>
              <p>
                Total Hours : <b>{totalHours}</b>
              </p>
              <p>
                Rent Per Hour : <b>{(car.vehicles && car.vehicles[0]?.rentPerHour)}</b>
              </p>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  onChange={(e) => setdriver(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Driver Required</span>
              </label>

              <h3>Total Amount : {totalAmount}</h3>
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  totalAmount={totalAmount}
                  car={car}
                  driver={driver}
                  from={from}
                  to={to}
                  totalHours={totalHours}
                  dispatch={dispatch}
                  history={history}
                  setPaymentProcessing={setPaymentProcessing}
                />
              </Elements>
            </div>
          )}
        </div>

        {car.vehicles && car.vehicles[0]?.name && (
          <div className={`modal ${showModal ? 'block' : 'hidden'}`}>
            <div className="modal-content p-4">
              <h3 className="text-xl mb-4">Booked time slots</h3>
              {car.bookedTimeSlots && car.bookedTimeSlots.map((slot) => (
                <button key={slot.from} className="btn1 mt-2">
                  {slot.from} - {slot.to}
                </button>
              ))}
              <div className="text-right mt-5">
                <button
                  className="btn1"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>



  );
}

// Initialize Stripe only if we're not in dummy mode
const stripePromise = process.env.REACT_APP_STRIPE_PUBLIC_KEY ? 
  loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY) : 
  Promise.resolve(null);

export default BookingCar;
