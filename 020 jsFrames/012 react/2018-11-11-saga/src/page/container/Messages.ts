import { Store } from '../../store/reducers';
import { connect } from 'react-redux';
import Messages from '../component/Messages';

const mapStateToProps = (state: Store) => {
    return {
        messages: state.messages,
        userId: state.userId
    }
}

const MessageContainer = connect(mapStateToProps)(Messages);

export default MessageContainer;