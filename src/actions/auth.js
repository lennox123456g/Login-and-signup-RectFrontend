import AxiosInstance from '../containers/AxiosInstance'; // Import your configured axios instance
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
        'Authorization': `Bearer ${token}`
    };
};

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
        const response = await AxiosInstance.post('/auth/jwt/verify/', {
            token: accessToken
        });
        
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
        const response = await AxiosInstance.get('/auth/users/me/', {
            headers: getAuthHeaders()
        });

        dispatch({
            type: USER_LOADED_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                await dispatch(refreshToken());
                const retryResponse = await AxiosInstance.get('/auth/users/me/', {
                    headers: getAuthHeaders()
                });
                
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
        const response = await AxiosInstance.post('/auth/jwt/refresh/', {
            refresh
        });
        
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
        const response = await AxiosInstance.post('/auth/jwt/create/', {
            email, 
            password
        });

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
        const response = await AxiosInstance.post('/auth/users/', {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            re_password: confirmPassword
        });

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
        await AxiosInstance.post('/auth/users/activation/', {
            uid, 
            token
        });

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
        await AxiosInstance.post('/auth/users/reset_password/', {
            email
        });

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
        await AxiosInstance.post('/auth/users/reset_password_confirm/', {
            uid,
            token,
            new_password: newPassword,
            re_new_password: confirmNewPassword
        });

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
// AXIOS INTERCEPTOR SETUP FOR AXIOSINSTANCE
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

// Add request interceptor to automatically include Bearer tokens
AxiosInstance.interceptors.request.use(
    (config) => {
        const token = getFromLocalStorage('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for automatic token refresh
AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return AxiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshTokenValue = getFromLocalStorage('refresh');

            if (refreshTokenValue) {
                try {
                    const response = await AxiosInstance.post('/auth/jwt/refresh/', {
                        refresh: refreshTokenValue
                    });

                    const { access } = response.data;
                    setToLocalStorage('access', access);
                    
                    processQueue(null, access);
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    
                    return AxiosInstance(originalRequest);
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