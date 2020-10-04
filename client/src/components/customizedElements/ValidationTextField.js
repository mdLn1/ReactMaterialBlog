import TextField from '@material-ui/core/TextField';
import { secondary, error } from "../../AppColors"
import
{
    withStyles
} from '@material-ui/core/styles';

export default withStyles({
    root: {
        '& input + fieldset': {
            borderColor: secondary,
            borderWidth: 1,
        },
        '& input:invalid:focus + fieldset': {
            borderColor: error,
            borderWidth: 2,
        }
    },
})(TextField);