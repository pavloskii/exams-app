import { store } from '../store';

export default (to, from, next) => {
    if (store.state.isAuthenticated) {
        next();
    }else {
        next("/signin");
    }
}