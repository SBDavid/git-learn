import store from '../store';

export default {
    login: () => {
        store.dispatch({
            type: 'LOGIN'
        });
    }
}