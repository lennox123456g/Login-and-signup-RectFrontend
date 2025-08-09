import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import AxiosInstance from './AxiosInstance';

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
                await AxiosInstance.post('/api/email-signup/ebook-signup', body, config);
                
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
            <div class='flex  justify items-center px-4 bg-white w-full min-h-screen '>
                <div class='text-center max-w-md'>
                    <div class='mb-4 p-6 bg-green-50 border border-green-200 rounded-lg'>
                        <div class='text-green-600 text-4xl mb-2'>✓</div>
                        <h2 class='text-2xl font-bold text-green-800 mb-2'>Success!</h2>
                        <p class='text-green-700'>
                            Thank you for signing up! Check your email for your free eBook.
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({ first_name: '', email: '' });
                            setAgree(false);
                        }}
                     class='text-blue-600 hover:text-blue-800 underline'
                    >
                        Submit another form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div class='min-h-screen flex flex-col justify items-center px-4 bg-white mt-15  '>
            <h1 class='text-3xl md:text-3xl font-bold text-center md:mt-5 md:mb-5 text-black max-w-2xl leading-none mt-15 mb-10 '>
                Sign up to our email list to stay in the Loop!
            </h1>
            <div class='w-full md:max-w-md max-w-sm border border-black rounded-lg p-6 '>
                <div class='mb-6'>
                    <label class='block text-sm font-medium text-gray-700 mb-2'>
                        First Name:
                    </label>
                    <input
                     class='w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        type='text'
                        name='first_name'
                        onChange={e => onChange(e)}
                        value={first_name}
                        required
                    />
                </div>
                <div class='mb-6'>
                    <label class='block text-sm font-medium text-gray-700 mb-2'>
                        Email:
                    </label>
                    <input
                     class='w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        type='email'
                        name='email'
                        onChange={e => onChange(e)}
                        value={email}
                        required
                    />
                </div>
                <div class='mb-6 flex '>
                    <input
                     class='mt-1 h-4 w-4 text-blue-600 bg-white focus:ring-blue-500 border-gray-300 rounded'
                        type='checkbox'
                        name='agree'
                        id='agree'
                        onChange={e => onChecked(e)}
                        checked={agree}
                        required
                    />
                    <label
                     class='ml-2 text-sm text-gray-600'
                     htmlFor='agree'
                    >
                        I agree to the Privacy Policy and Terms of Service
                    </label>
                </div>
                {
                    loading ? (
                        <div class='flex justify-center items-center'>
                            <ArrowPathIcon 
                             class='animate-spin text-blue-500 h-12 w-12'
                            />
                        </div>
                    ) : (
                        <button 
                            onClick={onSubmit}
                            disabled={!first_name || !email || !agree}
                         class='w-full bg-green-400 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                        >
                            KEEP ME POSTED!
                        </button>
                    )
                }
            </div>
        </div>
    );
};

export default Home;