import React from "react"
import { primary } from "../../AppColors"
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

export default () =>
{
    return (
        <Typography variant="body2" align="center">
            {'Copyright © '}
            <Link style={{ color: primary }} to={window.location.hostname}>
                {window.location.hostname}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}