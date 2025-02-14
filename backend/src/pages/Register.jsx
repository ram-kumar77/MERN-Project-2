import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from '../redux/actions/userActions';
import Spinner from '../components/Spinner';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { loading } = useSelector(state => state.alertsReducer);

    async function onFinish(event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const values = Object.fromEntries(formData.entries());
            
            await dispatch(userRegister(values));
            history.push('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    return (
        <div className='register'>
            {loading && (<Spinner />)}
            <div className="justify-center items-center min-h-screen">
                <div className="justify-center items-center">
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={onFinish}>
                        <h1 className='text-2xl font-bold mb-4'>Carzz</h1>
                        <h1 className='text-xl mb-4'>Register</h1>
                        <hr className='mb-4' />
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                name="username"
                                type="text"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpassword">
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cpassword"
                name="cpassword"
                type="password"
                required
              />
            </div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2' type="submit">
                            Register
                        </button>
                        <hr className='my-4' />
                        <Link to='/login' className='text-blue-500 hover:text-blue-700'>
                            Already have an account? Login
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;