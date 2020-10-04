import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import { API_URL } from '../AppSettings'
import MainContext from '../contexts/main/mainContext';
import { Redirect } from "react-router-dom"
class OAuth extends Component
{
    static contextType = MainContext;

    state = {
        disabled: false
    }


    componentDidMount()
    {
        const { socket, provider } = this.props

        socket.on(provider, (data) =>
        {
            if (data.error)
                console.error(data.error)

            this.popup.close()
            this.context.oAuthLogin({ user: data.user, token: data.token, oAuthProvider: provider })
        })
    }

    checkPopup()
    {
        const check = setInterval(() =>
        {
            const { popup } = this
            if (!popup || popup.closed || popup.closed === undefined)
            {
                clearInterval(check)
                this.setState({ disabled: false })
            }
        }, 1000)
    }

    openPopup()
    {
        const { provider, socket } = this.props
        const width = 600, height = 600
        const left = (window.innerWidth / 2) - (width / 2)
        const top = (window.innerHeight / 2) - (height / 2)
        const url = `${API_URL}/api/auth/${provider}?socketId=${socket.id}`

        return window.open(url, '',
            `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
        )
    }

    startAuth = () =>
    {
        if (!this.state.disabled)
        {
            this.popup = this.openPopup()
            this.checkPopup()
            this.setState({ disabled: true })
        }
    }

    render()
    {
        const { disabled } = this.state
        const { provider } = this.props
        const { user } = this.context

        let buttonProps = {};
        if (disabled)
            buttonProps = { disabled: true }

        return (
            user ? <Redirect exact to="/" /> :
                <Button
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={this.startAuth}
                    {...buttonProps}
                >
                    Login with <Icon className={`fab fa-${provider}`} style={{ marginLeft: '15px' }} />
                </Button>

        )
    }
}

OAuth.propTypes = {
    provider: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired,
}


export default OAuth