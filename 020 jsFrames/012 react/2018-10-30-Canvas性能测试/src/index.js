import App from './app';
import Test from './Test';

window.onload = () => {
    const container = document.getElementsByClassName('container')[0];
    setTimeout(() => {
        // const app = new App(document.getElementById('canvas'), container.clientWidth, container.clientHeight);
        Test.update();
    }, 500)
}