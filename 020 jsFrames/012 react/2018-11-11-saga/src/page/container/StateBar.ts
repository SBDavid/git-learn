import { connect } from 'react-redux';
import { Store } from '../../store/reducers';
import { Dispatch } from 'redux';
import StateBarComp from '../component/StateBar';

const mapStateToProps = (state: Store) => {
    return {
        state: state.login,
        messages: state.messages,
        userId: state.userId
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        login: () => {
            dispatch({
                type: 'login'
            })
        },
        logout: () => {
            dispatch({
                type: 'logout'
            })
        },
        pending: () => {
            dispatch({
                type: 'pending'
            })
        },
        setUserId: (userId: String) => {
            dispatch({
                type: 'setUserId',
                userId
            })
        }
    }
}

const StateBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StateBarComp);

export default StateBarContainer;