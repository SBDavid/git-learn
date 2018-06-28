import {Common} from '../../common/CommonUtils'
export default class BlockStatus{
	constructor() {
		this.isDownloading = false;
		this.httpDownloadErrorCount = 0;
		this.httpHasTimeouted = false;
	}
	
	isDroppable(){
		return  !isDownloading;
	}
	
	get isUnAvailable(){
		return this.httpDownloadErrorCount >= Common.HTTP_DOWNLOAD_MAX_RETRY_TIMES
				|| this.httpHasTimeouted;
	}
}