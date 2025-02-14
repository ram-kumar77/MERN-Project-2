import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('AdminHome mounted, user:', user); 
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  const confirmDelete = (carId) => {
    if (window.confirm("Are you sure to delete this car?")) {
      dispatch(deleteCar({ carid: carId }));
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center mt-2">
        <div className="lg:w-5/6 sm:w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-bold text-2xl ">Admin Panel</h3>
            <Link 
  to="/addcar" 
  className="btn1 bg-blue-200 p-2 rounded-lg hover:bg-blue-300 transition-colors duration-200 inline-block"
>
  ADD CAR
</Link>
          </div>
        </div>
      </div>

      {loading && <Spinner />}

      <div className="flex justify-between align-middle mt-10 ">
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 gap-4 ">
        {totalCars.map((car) => (
  <div key={car._id} className="car p-2 bs1">
    {car.vehicles && car.vehicles[0] && (
      <>
        <img 
          src={car.vehicles[0].image} 
          className="carimg rounded-lg h-40 w-80" 
          alt={car.vehicles[0].name} 
        />

        <div className="car-content flex justify-between items-center mt-2 ">
          <div className="text-left pl-2">
            <p>{car.vehicles[0].name}</p>
            <p>Rent Per Hour {car.vehicles[0].rentPerHour} /-</p>
            <p className="text-sm text-gray-600">Category: {car.category}</p>
          </div>

          <div className="mr-4 flex items-center translate-x-5">
            <Link to={`/editcar/${car._id}`}>
              <FaEdit className="mr-3 text-green-500 cursor-pointer" />
            </Link>

            <FaTrashAlt
              className="text-red-500 cursor-pointer"
              onClick={() => confirmDelete(car._id)}
            />
          </div>
        </div>
      </>
    )}
  </div>
))}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default AdminHome;