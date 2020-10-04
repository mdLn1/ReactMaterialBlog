import { TEST } from '../../types'

export function testFramework(obj, dispatch)
{
    dispatch({ type: TEST, payload: obj })
}