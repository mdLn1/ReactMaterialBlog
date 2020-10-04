import { LOGIN_FAILED, LOGIN_SUCCESS, REGISTER_SUCCESS, REGISTER_FAILED, SET_LOADING } from "../../types"
import axios from "axios"

export async function loginUserDef(user, dispatch)
{
    setLoading();
    try
    {
        const res = await axios.post("/api/auth", { data: { ...user } });

        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } catch (err)
    {
        dispatch({ type: LOGIN_FAILED, payload: err.response.data });
    }
}

export async function registerUserDef(user, dispatch)
{
    setLoading();
    try
    {
        const res = await axios.post("/api/auth", { data: { ...user } });

        dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    } catch (err)
    {
        dispatch({ type: REGISTER_FAILED, payload: err.response.data });
    }
}

function setLoading(dispatch)
{
    dispatch({ type: SET_LOADING });
};