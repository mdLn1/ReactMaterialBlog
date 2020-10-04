import
{
    LOGIN_FAILED, LOGIN_SUCCESS, OAUTH_LOGIN_SUCCESS, OAUTH_LOGIN_FAILED,
    LOGOUT, REGISTER_FAILED, REGISTER_SUCCESS, TEST
} from "../types"

export default (state, action) =>
{
    switch (action.type)
    {
        case LOGIN_SUCCESS:
            return { ...state, user: action.payload, loading: false }
        case LOGIN_FAILED:
            return { ...state, user: null, errors: action.payload, loading: false }
        case OAUTH_LOGIN_SUCCESS:
            return { ...state, ...action.payload, loading: false }
        case OAUTH_LOGIN_FAILED:
            return { ...state, user: null, errors: action.payload, loading: false }
        case REGISTER_SUCCESS:
            return { ...state, user: action.payload, loading: false }
        case REGISTER_FAILED:
            return { ...state, user: null, errors: action.payload, loading: false }
        case TEST:
            return { ...state, testObj: action.payload }
        default:
            return state;
    }
}