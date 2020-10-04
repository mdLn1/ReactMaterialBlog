import React, { useReducer } from 'react';
import MainContext from './mainContext';
import mainReducer from './mainReducer';
import { loginUserDef, registerUserDef, testFramework } from './functions'
import { OAUTH_LOGIN_SUCCESS, TEST } from '../types';

export default (props) =>
{
    const initialState = {
        user: null,
        loggedIn: false,
        loading: false,
        oAuthProvider: null,
        token: null,
        testObj: "something"
    };

    const [state, dispatch] = useReducer(mainReducer, initialState);

    const loginUser = (user) => loginUserDef(user, dispatch)
    const oAuthLogin = (data) =>
    {
        dispatch({ type: OAUTH_LOGIN_SUCCESS, payload: data });
    }
    const registerUser = (user) => registerUserDef(user, dispatch)
    const test = (user) => testFramework(user, dispatch)

    return (
        <MainContext.Provider
            value={{
                user: state.user,
                loggedIn: state.loggedIn,
                loading: state.loading,
                oAuthProvider: state.oAuthProvider,
                testObj: state.testObj,
                test,
                oAuthLogin
            }}
        >
            {props.children}
        </MainContext.Provider>
    );
}