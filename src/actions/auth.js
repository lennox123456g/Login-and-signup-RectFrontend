import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_REQUEST,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_REQUEST,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_REQUEST,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    LOGOUT,
    TOKEN_REFRESH_SUCCESS,
    TOKEN_REFRESH_FAIL,
    CLEAR_AUTH_ERRORS
} from './types';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getFromLocalStorage = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error accessing localStorage for key "${key}":`, error);
        return null;
    }
};

const setToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting localStorage for key "${key}":`, error);
    }
};

const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
};

const getAuthHeaders = () => {
    const token = getFromLocalStorage('access');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const getBasicHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

const extractErrorMessage = (errorData, defaultMessage = 'An error occurred') => {
    if (!errorData) return defaultMessage;
    const fieldErrors = ['email', 'password', 'first_name', 'last_name'];
    for (const field of fieldErrors) {
        if (errorData[field]) {
            return Array.isArray(errorData[field]) ? errorData[field][0] : errorData[field];
        }
    }
    if (errorData.non_field_errors) {
        return Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors;
    }
    if (errorData.detail) {
        return errorData.detail;
    }
    return defaultMessage;
};

// =============================================================================
// AUTHENTICATION STATUS ACTIONS
// =============================================================================

export const clearAuthErrors = () => ({
    type: CLEAR_AUTH_ERRORS
});

export const checkAuthenticated = () => async dispatch => {
    const accessToken = getFromLocalStorage('access');
    
    if (!accessToken) {
        dispatch({ type: AUTHENTICATED_FAIL });
        return;
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/jwt/verify/`,
            { token: accessToken },
            { headers: getBasicHeaders() }
        );
        
        if (response.status === 200) {
            dispatch({ type: AUTHENTICATED_SUCCESS });
        } else {
            dispatch({ type: AUTHENTICATED_FAIL });
        }
    } catch (error) {
        const refreshToken = getFromLocalStorage('refresh');
        
        if (refreshToken) {
            try {
                await dispatch(refreshToken());
                dispatch({ type: AUTHENTICATED_SUCCESS });
            } catch (refreshError) {
                dispatch({ type: AUTHENTICATED_FAIL });
            }
        } else {
            dispatch({ type: AUTHENTICATED_FAIL });
        }
    }
};

export const loadUser = () => async dispatch => {
    const accessToken = getFromLocalStorage('access');
    
    if (!accessToken) {
        dispatch({ type: USER_LOADED_FAIL });
        return;
    }

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/users/me/`,
            { headers: getAuthHeaders() }
        );

        dispatch({
            type: USER_LOADED_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                await dispatch(refreshToken());
                const retryResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/users/me/`,
                    { headers: getAuthHeaders() }
                );
                
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: retryResponse.data
                });
            } catch (refreshError) {
                dispatch({
                    type: USER_LOADED_FAIL,
                    payload: 'Failed to load user data'
                });
            }
        } else {
            dispatch({
                type: USER_LOADED_FAIL,
                payload: extractErrorMessage(error.response?.data, 'Failed to load user data')
            });
        }
    }
};

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

export const refreshToken = () => async dispatch => {
    const refresh = getFromLocalStorage('refresh');
    
    if (!refresh) {
        dispatch({ type: TOKEN_REFRESH_FAIL });
        dispatch(logout());
        return;
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`,
            { refresh },
            { headers: getBasicHeaders() }
        );
        
        setToLocalStorage('access', response.data.access);
        
        dispatch({
            type: TOKEN_REFRESH_SUCCESS,
            payload: response.data
        });

        return response.data.access;
    } catch (error) {
        const errorMessage = extractErrorMessage(
            error.response?.data,
            'Token refresh failed'
        );

        dispatch({
            type: TOKEN_REFRESH_FAIL,
            payload: errorMessage
        });
        
        dispatch(logout());
        throw error;
    }
};

// =============================================================================
// AUTHENTICATION ACTIONS
// =============================================================================

export const login = (email, password) => async dispatch => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/jwt/create/`,
            { email, password },
            { headers: getBasicHeaders() }
        );

        setToLocalStorage('access', response.data.access);
        if (response.data.refresh) {
            setToLocalStorage('refresh', response.data.refresh);
        }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errorMessage = extractErrorMessage(
            error.response?.data,
            'Login failed. Please check your credentials.'
        );
        
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage
        });

        throw error;
    }
};

export const signup = (firstName, lastName, email, password, confirmPassword) => async dispatch => {
    dispatch({ type: SIGNUP_REQUEST });

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/users/`,
            {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                re_password: confirmPassword
            },
            { headers: getBasicHeaders() }
        );

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: response.data
        });

        return response;
    } catch (error) {
        const errorMessage = extractErrorMessage(
            error.response?.data,
            'Registration failed'
        );

        dispatch({
            type: SIGNUP_FAIL,
            payload: errorMessage
        });

        throw new Error(errorMessage);
    }
};

export const logout = () => dispatch => {
    removeFromLocalStorage('access');
    removeFromLocalStorage('refresh');
    
    dispatch({ type: LOGOUT });
};

// =============================================================================
// ACCOUNT MANAGEMENT ACTIONS
// =============================================================================

export const verifyEmail = (uid, token) => async dispatch => {
    dispatch({ type: ACTIVATION_REQUEST });

    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/users/activation/`,
            { uid, token },
            { headers: getBasicHeaders() }
        );

        dispatch({
            type: ACTIVATION_SUCCESS,
            payload: 'Account activated successfully!'
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(
            error.response?.data,
            'Account activation failed. Please check your activation link.'
        );

        dispatch({
            type: ACTIVATION_FAIL,
            payload: errorMessage
        });

        throw error;
    }
};

export const resetPassword = (email) => async dispatch => {
    dispatch({ type: PASSWORD_RESET_REQUEST });

    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/users/reset_password/`,
            { email },
            { headers: getBasicHeaders() }
        );

        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload: 'Password reset email sent successfully!'
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(
            error.response?.data,
            'Failed to send password reset email.'
        );

        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: errorMessage
        });

        throw error;
    }
};

export const confirmPasswordReset = (uid, token, newPassword, confirmNewPassword) => async dispatch => {
    dispatch({ type: PASSWORD_RESET_CONFIRM_REQUEST });

    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/users/reset_password_confirm/`,
            {
                uid,
                token,
                new_password: newPassword,
                re_new_password: confirmNewPassword
            },
            { headers: getBasicHeaders() }
        );

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload: 'Password reset successfully!'
        });
    } catch (error) {
        let errorMessage = 'Password reset failed';

        if (error.response?.data) {
            const errorData = error.response.data;
            if (errorData.new_password) {
                errorMessage = Array.isArray(errorData.new_password) 
                    ? errorData.new_password[0] 
                    : errorData.new_password;
            } else if (errorData.token) {
                errorMessage = 'Invalid or expired reset token';
            } else if (errorData.uid) {
                errorMessage = 'Invalid reset link';
            } else {
                errorMessage = extractErrorMessage(errorData, errorMessage);
            }
        }

        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL,
            payload: errorMessage
        });

        throw error;
    }
};

// =============================================================================
// AXIOS INTERCEPTOR SETUP
// =============================================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshTokenValue = getFromLocalStorage('refresh');

            if (refreshTokenValue) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`,
                        { refresh: refreshTokenValue }
                    );

                    const { access } = response.data;
                    setToLocalStorage('access', access);
                    
                    processQueue(null, access);
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    
                    return axios(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    removeFromLocalStorage('access');
                    removeFromLocalStorage('refresh');
                    
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                removeFromLocalStorage('access');
                removeFromLocalStorage('refresh');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

// =============================================================================
// BACKWARDS COMPATIBILITY EXPORTS
// =============================================================================

export const load_user = loadUser;
export const verify = verifyEmail;
export const reset_password = resetPassword;
export const reset_password_confirm = confirmPasswordReset;

/*Great question! The choice between "JWT" and "Bearer" in the Authorization header isn't arbitrary - it's about following web standards and what your API expects.
Why Bearer, not JWT?
1. RFC 6750 Standard

Bearer is the official standard defined in RFC 6750 for OAuth 2.0 Bearer Token usage
It's the widely accepted convention across web APIs
Format: Authorization: Bearer <token>

2. JWT is the Token Type, Bearer is the Auth Scheme

JWT (JSON Web Token) = the format/structure of the token itself
Bearer = the authentication scheme that tells the server how to handle the token
Think of it like: "This is a Bearer token (and it happens to be in JWT format)"

3. API Framework Expectations

Most frameworks (Django REST Framework, Express.js, Spring Boot, etc.) expect Bearer by default
Your Django API is configured to look for Authorization: Bearer <token>
Using JWT instead of Bearer makes the API reject the request

Real-world Example:
javascript// ❌ WRONG - Custom scheme, not standard
Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// ✅ CORRECT - Standard Bearer scheme
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Why Some People Use "JWT"
Some developers mistakenly use JWT because:

They think it's more descriptive
They've seen it in tutorials that weren't following standards
They confuse token format with auth scheme

Best Practice
Always use Bearer unless your API specifically requires something else. It's the standard, widely supported, and what most authentication libraries expect.
Your Django backend was rejecting JWT tokens because it's configured to only accept Bearer tokens - that's why you were getting 401 errors! */