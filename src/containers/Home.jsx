import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        email: '',
    });

    const { first_name, email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onChecked = e => setAgree(e.target.checked);

    const onSubmit = e => {
        e.preventDefault();

        // Simulate API call with timeout for demo purposes
        const simulateSubmit = async () => {
            setLoading(true);
            try {
                // Define the request body for your backend
                const body = {
                    first_name,
                    email,
                    agree
                };
                
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                
                // Make the API call to your backend (which will handle ActiveCampaign)
                await axios.post('http://localhost:8000/api/email-signup/ebook-signup', body, config);
                
                setSubmitted(true);
                console.log('Form submitted:', { email, first_name, agree });
            } catch(err) {
                console.error('Error submitting form:', err);
            }
            setLoading(false);
        };

        simulateSubmit();
    }

    if (submitted) {
        return (
            <div className='mt-12 flex flex-col justify-center items-center px-4 bg-white'>
                <div className='text-center max-w-md'>
                    <div className='mb-4 p-6 bg-green-50 border border-green-200 rounded-lg'>
                        <div className='text-green-600 text-4xl mb-2'>✓</div>
                        <h2 className='text-2xl font-bold text-green-800 mb-2'>Success!</h2>
                        <p className='text-green-700'>
                            Thank you for signing up! Check your email for your free eBook.
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({ first_name: '', email: '' });
                            setAgree(false);
                        }}
                        className='text-blue-600 hover:text-blue-800 underline'
                    >
                        Submit another form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-12 flex flex-col justify-center items-center px-4 bg-white'>
            <h1 className='text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800 max-w-4xl leading-tight'>
                Sign up to our email list to receive your FREE eBook!
            </h1>
            <div className='w-full max-w-md'>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        First Name:
                    </label>
                    <input
                        className='w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        type='text'
                        name='first_name'
                        onChange={e => onChange(e)}
                        value={first_name}
                        required
                    />
                </div>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email:
                    </label>
                    <input
                        className='w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        type='email'
                        name='email'
                        onChange={e => onChange(e)}
                        value={email}
                        required
                    />
                </div>
                <div className='mb-6 flex items-start'>
                    <input
                        className='mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        type='checkbox'
                        name='agree'
                        id='agree'
                        onChange={e => onChecked(e)}
                        checked={agree}
                        required
                    />
                    <label
                        className='ml-2 text-sm text-gray-600'
                        htmlFor='agree'
                    >
                        I agree to the Privacy Policy and Terms of Service
                    </label>
                </div>
                {
                    loading ? (
                        <div className='flex justify-center items-center'>
                            <ArrowPathIcon 
                                className='animate-spin text-blue-500 h-12 w-12'
                            />
                        </div>
                    ) : (
                        <button 
                            onClick={onSubmit}
                            disabled={!first_name || !email || !agree}
                            className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                        >
                            GIVE ME MY FREE EBOOK
                        </button>
                    )
                }
            </div>
        </div>
    );
};

export default Home;