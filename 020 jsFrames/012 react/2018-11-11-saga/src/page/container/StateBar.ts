import { connect } from 'react-redux';
import { Store } from '../../store/reducers';
import { Dispatch } from 'redux';
import StateBarComp from '../component/StateBar';
import { loginAction } from '../../store/login';

const mapStateToProps = (state: Store) => {
    return {
        login: state.login,
        messages: state.messages,
        userId: state.userId
    }
}

const mapDispatchToProps = (dispatch: Dispatch<loginAction>) => {
    return {
        logout: () => {
            dispatch({
                type: 'logout'
            })
        }
    }
}

const StateBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StateBarComp);

export default StateBarContainer;