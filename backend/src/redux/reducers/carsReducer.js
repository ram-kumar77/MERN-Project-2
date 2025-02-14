const initialState = {
    cars: [],
    loading: false,
    error: null
};

export const carsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALL_CARS':
            return {
                ...state,
                cars: action.payload
            };
        case 'LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};