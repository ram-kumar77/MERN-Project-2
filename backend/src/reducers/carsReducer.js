const initialState = {
  cars: [],
  loading: false,
  error: null,
};

export const carsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_CARS':
      console.log('Updating cars state with:', action.payload); // Log the payload
      return {
        ...state,
        cars: action.payload,
        loading: false,
      };
    case 'ERROR':
      console.error('Error fetching cars:', action.payload); // Log the error
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
