import { GET_ALL_BOOKINGS } from '../types';

const initialState = {
  bookings: []
};

const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
      };
    default:
      return state;
  }
};

export default bookingsReducer;