import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCars } from "../redux/actions/carsActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faLocationDot, faCarSide, faCarRear, faBus, faCalendarDays, faBed } from '@fortawesome/free-solid-svg-icons';
import DefaultLayout from '../components/DefaultLayout';
import { Link } from 'react-router-dom';
import { DateRange } from 'react-date-range'; // Importing DateRange
import { format } from 'date-fns'; // Importing format
import About from '../components/About';
import Spinner from '../components/Spinner'; // Importing Spinner
import Footer from '../components/Footer';
import { useHistory } from 'react-router-dom'; // Add useHistory

function Home() {
  const dispatch = useDispatch();
  const history = useHistory(); // Add this
  const { cars, loading } = useSelector(state => state.carsReducer);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);
  const [opendate, setOpendate] = useState(false);
  const [date, setDate] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, rooms: 1 });

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    if (cars && cars.length > 0) {
      setFilteredCars(cars);
      console.log('Filtered cars:', cars); // Log the fetched cars
    }
  }, [cars]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    let filtered = cars;
    
    // Apply search term filter
    if (term) {
      filtered = filtered.filter(car => {
        return (
          car.category.toLowerCase().includes(term) ||
          car.vehicles.some(vehicle => 
            vehicle.name.toLowerCase().includes(term) ||
            vehicle.brand?.toLowerCase().includes(term)
          )
        );
      });
    }
    
    // Apply date filter
    const fromDate = date[0].startDate;
    const toDate = date[0].endDate;
    
    filtered = filtered.filter(car => {
      return car.vehicles.some(vehicle => {
        // Check if vehicle is available for selected dates
        const isAvailable = !vehicle.bookedTimeSlots?.some(slot => {
          const slotFrom = new Date(slot.from);
          const slotTo = new Date(slot.to);
          return (fromDate <= slotTo && toDate >= slotFrom);
        });
        return isAvailable;
      });
    });
    
    console.log('Filtering cars:', filtered);
    setFilteredCars(filtered);
  };

  const handleOption = (type, operation) => {
    setOptions(prev => {
      return {
        ...prev,
        [type]: operation === 'i' ? prev[type] + 1 : prev[type] - 1,
      };
    });
  };

  const handleBooking = (carId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      history.push('/login');
      return;
    }
    // Pass selected dates as query parameters
    history.push({
      pathname: `/booking/${carId}`,
      search: `?from=${format(date[0].startDate, 'yyyy-MM-dd')}&to=${format(date[0].endDate, 'yyyy-MM-dd')}`
    });
  };

  return (
        <DefaultLayout>
            <div className="bg-blue-800 text-white flex justify-center relative">
                <div className="w-full max-w-7xl my-5 mb-24">
                    <div className="flex gap-10 mb-12">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCar} />
                            <span>Sedan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCarSide} />
                            <span>SUV</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCarRear} />
                            <span>Luxury</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBus} />
                            <span>MUV</span>
                        </div>
                    </div>
                    <h1 className="text-8xl font-bold mb-2">
                        Book your Car now!
                    </h1>
                    <p className="my-5 tracking-loose kerning-wide">  
                        With a lot of Discounts and savings up to <span className='text-bold'>30%</span> and more..
                    </p>
                    <Link to="/login">
                        <button className="bg-blue-600 text-white font-medium border-none px-4 py-2 rounded cursor-pointer">
                            SignIn/Register
                        </button>
                    </Link>
                    <div className="h-14 bg-white border-4 border-yellow-400 flex items-center justify-around py-2 rounded absolute -bottom-7 w-full max-w-7xl">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              className="border-none outline-none w-64 text-black" 
              placeholder="Search Cars or Brands Eg.Tata" 
            />
          </div>
                
                        <div className="flex items-center gap-2 relative">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-gray-500" />
                            <span 
                                onClick={() => setOpendate(!opendate)}
                                className="text-gray-400 cursor-pointer">
                                {`${format(date[0].startDate, "dd/MM/yyyy")} to 
                                ${format(date[0].endDate, "dd/MM/yyyy")}`}
                            </span>
                            {opendate && (
                                <div className="absolute top-12 z-10">
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={item => setDate([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={date}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <FontAwesomeIcon icon={faBed} className="text-gray-500" />
                            <span 
                                onClick={() => setOpenOptions(!openOptions)}
                                className="text-gray-400 cursor-pointer">
                                {`${options.adult} Adults - ${options.children} Children - ${options.rooms} Cars`}
                            </span>
                            {openOptions && (
                                <div className="absolute top-12 bg-white text-gray-600 rounded shadow-lg z-10">
                                    <div className="w-52 flex justify-between m-2">
                                        <span className="text-gray-800">Adults</span>
                                        <div className="flex items-center gap-2 text-xs text-black">
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white disabled:cursor-not-allowed"
                                                disabled={options.adult <= 1}
                                                onClick={() => handleOption("adult", "d")}>-</button>
                                            <span>{options.adult}</span>
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white"
                                                onClick={() => handleOption("adult", "i")}>+</button>
                                        </div>
                                    </div>

                                    <div className="w-52 flex justify-between m-2">
                                        <span className="text-gray-800">Children</span>
                                        <div className="flex items-center gap-2 text-xs text-black">
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white disabled:cursor-not-allowed"
                                                disabled={options.children <= 0}
                                                onClick={() => handleOption("children", "d")}>-</button>
                                            <span>{options.children}</span>
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white"
                                                onClick={() => handleOption("children", "i")}>+</button>
                                        </div>
                                    </div>

                                    <div className="w-52 flex justify-between m-2">
                                        <span className="text-gray-800">Cars</span>
                                        <div className="flex items-center gap-2 text-xs text-black">
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white disabled:cursor-not-allowed"
                                                disabled={options.rooms <= 1}
                                                onClick={() => handleOption("rooms", "d")}>-</button>
                                            <span>{options.rooms}</span>
                                            <button 
                                                className="w-8 h-8 border border-blue-600 text-blue-600 cursor-pointer bg-white"
                                                onClick={() => handleOption("rooms", "i")}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button 
                          className="bg-blue-600 text-white font-medium px-4 py-2 cursor-pointer"
                          onClick={() => {
                            console.log('Search button clicked');
                            console.log('Current search term:', searchTerm);
                            console.log('Selected dates:', date);
                            // Trigger search with current filters
                            handleSearch({ target: { value: searchTerm } });
                            console.log('Filtered cars:', filteredCars);
                          }}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {loading && <Spinner />}
            
<div className="flex justify-center px-4 py-8 mt-16">
  <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full max-w-7xl">
  {filteredCars.slice(0, 3).map(car => (
      <div key={car._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">        <img 
          src={car.vehicles[0].image} 
          alt={car.vehicles[0].name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{car.vehicles[0].name}</h3> 
              <p className="text-gray-600">₹{car.vehicles[0].rentPerHour}/hour</p> 
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <p>Fuel Type: {car.vehicles[0].fuelType}</p> 
              <p>Capacity: {car.vehicles[0].capacity} persons</p> 
              <p>Transmission: {car.vehicles[0].transmission}</p> 
            </div>
            <button 
          onClick={() => handleBooking(car._id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition-all"
        >
          Book Now
        </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      <About />
      <Footer />
    </DefaultLayout>
  );
}

export default Home;
