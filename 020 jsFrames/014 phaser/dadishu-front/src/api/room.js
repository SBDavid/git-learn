import utils from '../utils';

const search = window.location.search;

const querys = utils.parseQuery(search);

export default {
    roomId: querys.roomId
}