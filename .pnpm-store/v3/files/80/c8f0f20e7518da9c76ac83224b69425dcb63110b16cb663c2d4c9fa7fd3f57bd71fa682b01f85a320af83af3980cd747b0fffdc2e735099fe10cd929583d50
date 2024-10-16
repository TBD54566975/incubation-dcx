import { VERSION_CHECK_DIRECTION, VERSION_KEY, } from '../constants/update.constants.js';
export class UpdateService {
    httpsService;
    constructor(httpsService) {
        this.httpsService = httpsService;
    }
    /**
     * Check if localVersion is greater or equal to remote version
     * ignoring the pre-release tag. ex: 1.3.12 = 1.3.12-21
     */
    async isUpdated(localVersion) {
        const removePreReaseTag = (value) => value.split('-')[0];
        const localVersionPrepared = removePreReaseTag(localVersion);
        const remoteVersion = await this.getRemoteVersion();
        const remoteVersionPrepared = removePreReaseTag(remoteVersion);
        return this.compareVersions(localVersionPrepared, remoteVersionPrepared);
    }
    compareVersions(local, remote) {
        return (this.isSameVersion(local, remote) ||
            this.isLocalVersionGreater(local, remote));
    }
    async getRemoteVersion() {
        const response = await this.httpsService.getJson(VERSION_CHECK_DIRECTION);
        return response[VERSION_KEY];
    }
    isSameVersion(version1, version2) {
        return version1 === version2;
    }
    /** Valid to compare versions up to 99999.99999.99999 */
    isLocalVersionGreater(local, remote) {
        const leadingZeros = (value) => ('00000' + value).substring(-5);
        const localLeaded = +local.split('.').map(leadingZeros).join('');
        const remoteLeaded = +remote.split('.').map(leadingZeros).join('');
        return localLeaded >= remoteLeaded;
    }
}
