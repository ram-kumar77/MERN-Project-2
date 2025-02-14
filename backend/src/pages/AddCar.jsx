import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import { addCar } from '../redux/actions/carsActions'

function AddCar() {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.alertsReducer)

    function onFinish(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const values = Object.fromEntries(formData.entries());
        values.bookedTimeSlots = [];

        dispatch(addCar(values))
        console.log(values)
    }

    return (
        <DefaultLayout>
            {loading && (<Spinner />)}
            <div className="flex justify-center mt-5">
                <div className="lg:w-1/2 sm:w-full p-2">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onFinish}>
                        <h3 className="text-xl mb-4">Add New Car</h3>
                        <hr className="mb-4" />
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transmission">
                                Transmission
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="transmission"
                                name="transmission"
                                type="text"
                                required
                            />
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Car name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                name="name"
                                type="text"
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
                                required
                            />
                        </div>
                        <div className="text-right">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                ADD CAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default AddCar
