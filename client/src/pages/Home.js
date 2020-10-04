import React, { useContext } from 'react'
import MainContext from '../contexts/main/mainContext'

const Home = () =>
{
    const mainContext = useContext(MainContext)

    const { test, testObj } = mainContext;


    return (
        <div className="home">
            home
            <button onClick={() => { test("else") }}>click me</button>
            {testObj}
            <div>
                hello
        </div>
        </div>
    )
}

export default Home
