import AxiosInstance from './AxiosInstance';
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


// Helper function to safely access localStorage
const getFromLocalStorage = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
    }
};

// Helper function to safely set localStorage
const setToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error setting localStorage:', error);
    }
};

// Helper function to safely remove from localStorage
const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = getFromLocalStorage('access');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `JWT ${token}` })
    };
};

// Clear authentication errors
export const clearAuthErrors = () => ({
    type: CLEAR_AUTH_ERRORS
});

// Refresh token
export const refreshToken = () => async dispatch => {
    const refresh = getFromLocalStorage('refresh');
    
    if (!refresh) {
        dispatch({ type: TOKEN_REFRESH_FAIL });
        dispatch(logout());
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ refresh });

    try {
        const res = await AxiosInstance.post('/auth/jwt/refresh/', body, config);
        
        setToLocalStorage('access', res.data.access);
        
        dispatch({
            type: TOKEN_REFRESH_SUCCESS,
            payload: res.data
        });

        return res.data.access;
    } catch (err) {
        dispatch({
            type: TOKEN_REFRESH_FAIL,
            payload: err.response?.data?.detail || 'Token refresh failed'
        });
        
        // If refresh fails, logout the user
        dispatch(logout());
        throw err;
    }
};

// Load user with token refresh fallback
export const load_user = () => async dispatch => {
    const accessToken = getFromLocalStorage('access');
    
    if (!accessToken) {
        dispatch({ type: USER_LOADED_FAIL });
        return;
    }

    const config = {
        headers: getAuthHeaders()
    };

    try {
        const res = await AxiosInstance.get('/auth/users/me/', config);

        dispatch({
            type: USER_LOADED_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        // If token is expired, try to refresh
        if (err.response?.status === 401) {
            try {
                await dispatch(refreshToken());
                // Retry with new token
                const newConfig = {
                    headers: getAuthHeaders()
                };
                const retryRes = await AxiosInstance.get('/auth/users/me/', newConfig);
                
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: retryRes.data
                });
            } catch (refreshErr) {
                dispatch({
                    type: USER_LOADED_FAIL,
                    payload: 'Failed to load user data'
                });
            }
        } else {
            dispatch({
                type: USER_LOADED_FAIL,
                payload: err.response?.data?.detail || 'Failed to load user data'
            });
        }
    }
};

// Check if user is authenticated
export const checkAuthenticated = () => async dispatch => {
    const accessToken = getFromLocalStorage('access');
    
    if (!accessToken) {
        dispatch({ type: AUTHENTICATED_FAIL });
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const body = JSON.stringify({ token: accessToken });

    try {
        const res = await AxiosInstance.post('/auth/jwt/verify/', body, config);
        
        // If we get here without error, token is valid
        if (res.status === 200) {
            dispatch({ type: AUTHENTICATED_SUCCESS });
        } else {
            dispatch({ type: AUTHENTICATED_FAIL });
        }
    } catch (err) {
        // Token is invalid, try to refresh if we have a refresh token
        const refreshToken = getFromLocalStorage('refresh');
        
        if (refreshToken) {
            try {
                await dispatch(refreshToken());
                dispatch({ type: AUTHENTICATED_SUCCESS });
            } catch (refreshErr) {
                dispatch({ type: AUTHENTICATED_FAIL });
            }
        } else {
            dispatch({ type: AUTHENTICATED_FAIL });
        }
    }
};

// Login user
export const login = (email, password) => async dispatch => {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await AxiosInstance.post('/auth/jwt/create/', body, config);

        // Store tokens securely
        setToLocalStorage('access', res.data.access);
        if (res.data.refresh) {
            setToLocalStorage('refresh', res.data.refresh);
        }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        // Load user data after successful login
        dispatch(load_user());
    } catch (err) {
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.non_field_errors?.[0] ||
                           'Login failed. Please check your credentials.';
        
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage
        });
    }
};

// Sign up user
export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {
    dispatch({ type: SIGNUP_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ first_name, last_name, email, password, re_password });

    try {
        const res = await AxiosInstance.post('/auth/users/', body, config);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });

        return res; // Add this line to resolve the promise
    } catch (err) {
        const errorData = err.response?.data;
        let errorMessage = 'Registration failed';

        if (errorData) {
            if (errorData.email) {
                errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
            } else if (errorData.password) {
                errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
            } else if (errorData.non_field_errors) {
                errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
            }
        }

        dispatch({
            type: SIGNUP_FAIL,
            payload: errorMessage
        });

        throw new Error(errorMessage); // Add this line to allow catch in component
    }
};
// Verify email activation
export const verify = (uid, token) => async dispatch => {
    dispatch({ type: ACTIVATION_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await AxiosInstance.post('/auth/users/activation/', body, config);

        dispatch({
            type: ACTIVATION_SUCCESS,
            payload: 'Account activated successfully!'
        });
    } catch (err) {
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.uid?.[0] ||
                           err.response?.data?.token?.[0] ||
                           'Account activation failed. Please check your activation link.';

        dispatch({
            type: ACTIVATION_FAIL,
            payload: errorMessage
        });
    }
};

// Reset password request
export const reset_password = (email) => async dispatch => {
    dispatch({ type: PASSWORD_RESET_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await AxiosInstance.post('/auth/users/reset_password/', body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload: 'Password reset email sent successfully!'
        });
    } catch (err) {
        const errorMessage = err.response?.data?.email?.[0] || 
                           err.response?.data?.detail ||
                           'Failed to send password reset email.';

        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: errorMessage
        });
    }
};

// Confirm password reset
export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({ type: PASSWORD_RESET_CONFIRM_REQUEST });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
        await AxiosInstance.post('/auth/users/reset_password_confirm/', body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload: 'Password reset successfully!'
        });
    } catch (err) {
        const errorData = err.response?.data;
        let errorMessage = 'Password reset failed';

        if (errorData) {
            if (errorData.new_password) {
                errorMessage = Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password;
            } else if (errorData.token) {
                errorMessage = 'Invalid or expired reset token';
            } else if (errorData.uid) {
                errorMessage = 'Invalid reset link';
            } else if (errorData.non_field_errors) {
                errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
            }
        }

        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL,
            payload: errorMessage
        });
    }
};

// Logout user
export const logout = () => dispatch => {
    // Clear all auth-related data from localStorage
    removeFromLocalStorage('access');
    removeFromLocalStorage('refresh');
    
    dispatch({
        type: LOGOUT
    });
};

// Axios interceptor for automatic token refresh
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

// Add response interceptor to handle token refresh automatically
AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `JWT ${token}`;
                    return AxiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getFromLocalStorage('refresh');

            if (refreshToken) {
                try {
                    const response = await AxiosInstance.post('/auth/jwt/refresh/', {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    setToLocalStorage('access', access);
                    
                    processQueue(null, access);
                    originalRequest.headers['Authorization'] = `JWT ${access}`;
                    
                    return AxiosInstance(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    removeFromLocalStorage('access');
                    removeFromLocalStorage('refresh');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                removeFromLocalStorage('access');
                removeFromLocalStorage('refresh');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);