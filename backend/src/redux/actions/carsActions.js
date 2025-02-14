import axios from 'axios';
import { alert } from '../../utils/alert';

export const getAllCars = () => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const response = await axios.get('http://localhost:5000/api/cars/cars'); // Corrected endpoint
    console.log('Fetched cars:', response.data); // Log fetched data
    dispatch({ type: 'GET_ALL_CARS', payload: response.data });
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.error('Error fetching cars:', error);
    dispatch({ type: 'LOADING', payload: false });
    dispatch({ type: 'ERROR', payload: error.message });
  }
};
export const addCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    // Add base URL and ensure request body format is correct
    const response = await axios.post('http://localhost:5000/api/cars/addcar', {
      vehicles: [{
        name: reqObj.name,
        image: reqObj.image,
        rentPerHour: reqObj.rentPerHour,
        capacity: reqObj.capacity,
        fuelType: reqObj.fuelType,
        transmission: reqObj.transmission
      }],
      category: reqObj.category || 'standard'   
    });

    if (response.status === 200) {
      alert.success('Car added successfully');

      dispatch(getAllCars());
    }
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.error('Add car error:', error.response?.data || error.message);
    alert.error(error.response?.data?.message || 'Failed to add car');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const editCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const response = await axios.post('/api/cars/editcar', reqObj);
    if (response.status === 200) {
      alert.success('Car edited successfully');
    }
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.log(error);
    alert.error('Something went wrong');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const deleteCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    await axios.post('/api/cars/deletecar', reqObj);
    alert.success('Car deleted successfully');
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.log(error);
    alert.error('Something went wrong');
    dispatch({ type: 'LOADING', payload: false });
  }
};
