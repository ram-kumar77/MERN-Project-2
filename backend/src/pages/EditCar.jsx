import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { editCar, getAllCars } from "../redux/actions/carsActions";

function EditCar({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState();
  const [totalcars, settotalcars] = useState([]);

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    } else {
      settotalcars(cars);
      setcar(cars.find((o) => o._id === match.params.carid));
    }
  }, [cars, dispatch, match.params.carid]);

  function onFinish(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());
    values._id = car._id;

    // Create the updated vehicle data structure
    const updatedCar = {
      _id: car._id,
      category: values.category,
      vehicles: [{
        name: values.name,
        image: values.image,
        rentPerHour: values.rentPerHour,
        capacity: values.capacity,
        fuelType: values.fuelType,
      }]
    };

    dispatch(editCar(updatedCar));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="flex justify-center mt-5">
        <div className="lg:w-1/2 sm:w-full p-2">
          {totalcars.length > 0 && car && car.vehicles && car.vehicles[0] && (
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={onFinish}
            >
              <h3 className="text-xl mb-4">Edit Car</h3>
              <hr className="mb-4" />
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="category"
                  name="category"
                  type="text"
                  defaultValue={car.category}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Car name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={car.vehicles[0].name}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image url
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="image"
                  name="image"
                  type="text"
                  defaultValue={car.vehicles[0].image}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentPerHour">
                  Rent per hour
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rentPerHour"
                  name="rentPerHour"
                  type="text"
                  defaultValue={car.vehicles[0].rentPerHour}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                  Capacity
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="capacity"
                  name="capacity"
                  type="text"
                  defaultValue={car.vehicles[0].capacity}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fuelType">
                  Fuel Type
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fuelType"
                  name="fuelType"
                  type="text"
                  defaultValue={car.vehicles[0].fuelType}
                  required
                />
              </div>
              <div className="text-right">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Edit CAR
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default EditCar;