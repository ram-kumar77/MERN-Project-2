import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../redux/actions/userActions'
import { toast } from 'react-toastify'
import AOS from 'aos'
import Spinner from '../components/Spinner'
import 'aos/dist/aos.css'
import 'react-toastify/dist/ReactToastify.css'

AOS.init()

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { loading } = useSelector(state => state.alertsReducer);

    async function onFinish(event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const values = Object.fromEntries(formData.entries());
            
            // Check for admin credentials
            if (values.username === 'admin' && values.password === 'admin123') {
                const response = await dispatch(userLogin(values));
                console.log('Admin login response:', response); // Debug log
                if (response && response.isAdmin) {
                    toast.success('Welcome Admin!');
                    history.push('/admin'); // Remove setTimeout
                }
            } else {
                const response = await dispatch(userLogin(values));
                console.log('User login response:', response); // Debug log
                if (response) {
                    toast.success('Login successful!');
                    history.push('/'); // Remove setTimeout
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error(error.response?.data?.message || 'Invalid credentials');
        }
    }
    
    return (
        <div className='login'>
            {loading && (<Spinner />)}
            <div className="justify-center items-center min-h-screen">
                <div className="lg:w-2/3 w-full relative">
                    {/* <img
                        className='w-full'
                        data-aos='slide-right'
                        data-aos-duration='1500'
                        alt="Car rental login"
                        src="https://images.unsplash.com/photo-1532268116505-8c59cc37d2e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=864&q=80"
                    /> */}
                </div>
                <div className="justify-center items-center">
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={onFinish}>
                        <h1 className='text-2xl font-bold mb-4'>Carzz</h1>
                        <h1 className='text-xl mb-4'>Login</h1>
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
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2' type="submit">
                            Login
                        </button>
                        <hr className='my-4' />
                        <Link to='/register' className='text-blue-500 hover:text-blue-700'>
                            Click Here to Register
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login