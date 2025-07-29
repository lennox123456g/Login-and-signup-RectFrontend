import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verify } from '../actions/auth';

const Activate = () => {
    const [verified, setVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // Get URL parameters uid and token from react-router-dom v6 hook
    const { uid, token } = useParams();

    const verify_account = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Dispatch the verify action with uid and token
            await dispatch(verify(uid, token));
            setVerified(true);
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (verified) {
        // Redirect after successful verification
        return <Navigate to='/' />;
    }

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <div className='mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
                        <svg 
                            className='w-10 h-10 text-blue-600' 
                            fill='none' 
                            stroke='currentColor' 
                            viewBox='0 0 24 24'
                        >
                            <path 
                                strokeLinecap='round' 
                                strokeLinejoin='round' 
                                strokeWidth={2} 
                                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' 
                            />
                        </svg>
                    </div>
                    
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        Verify Your Account
                    </h1>
                    
                    <p className='text-gray-600 mb-8'>
                        Click the button below to activate your account and start using our services.
                    </p>
                    
                    <button
                        onClick={verify_account}
                        disabled={isLoading}
                        className={`
                            w-full py-3 px-6 text-white font-medium rounded-lg shadow-md
                            transition-all duration-200 transform
                            ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-300'
                            }
                        `}
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <svg 
                                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' 
                                    xmlns='http://www.w3.org/2000/svg' 
                                    fill='none' 
                                    viewBox='0 0 24 24'
                                >
                                    <circle 
                                        className='opacity-25' 
                                        cx='12' 
                                        cy='12' 
                                        r='10' 
                                        stroke='currentColor' 
                                        strokeWidth='4'
                                    />
                                    <path 
                                        className='opacity-75' 
                                        fill='currentColor' 
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    />
                                </svg>
                                Verifying...
                            </div>
                        ) : (
                            'Verify Account'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Activate;


/*Removed the old useSelector(null, { verify })(Activate) export style.

Used useDispatch hook to dispatch the verify action.

Used useParams hook from react-router-dom to get the uid and token from URL params instead of using match prop.

Added await dispatch(verify(uid, token)) to properly wait for the async action.

Component state handles loading and success (verified) properly.

Redirects user after successful verification using <Navigate />.*/