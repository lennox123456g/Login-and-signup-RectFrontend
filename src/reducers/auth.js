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
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    loading: false,
    error: null,
    message: null
};

export default function auth(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_REQUEST:
        case SIGNUP_REQUEST:
        case PASSWORD_RESET_REQUEST:
        case PASSWORD_RESET_CONFIRM_REQUEST:
        case ACTIVATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null
            };

        case LOGIN_SUCCESS:
        case TOKEN_REFRESH_SUCCESS:
            return {
                ...state,
                access: payload.access,
                refresh: payload.refresh || state.refresh,
                isAuthenticated: true,
                loading: false,
                error: null
            };

        case SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                isAuthenticated: false,
                message: 'Signup successful, please activate your account.'
            };

        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                loading: false
            };

        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            };

        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case ACTIVATION_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                message: payload // contains success message
            };

        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_FAIL:
        case USER_LOADED_FAIL:
        case AUTHENTICATED_FAIL:
        case TOKEN_REFRESH_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                isAuthenticated: false
            };

        case CLEAR_AUTH_ERRORS:
            return {
                ...state,
                error: null,
                message: null
            };

        case LOGOUT:
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null
            };

        default:
            return state;
    }
}

/*Requests (*_REQUEST): Sets loading: true, resets error and message.

Success (*_SUCCESS): Saves token, sets isAuthenticated, stores user or message.

Fail (*_FAIL): Sets error, turns off loading, resets auth.

LOGOUT: Clears tokens and resets all auth-related state.
CLEAR_AUTH_ERRORS: Resets messages and errors*/