import * as https from 'node:https';
export class HttpsService {
    async getJson(url) {
        return new Promise((resolve, reject) => {
            const fail = (err) => {
                reject(err);
            };
            const request = https.get(url, (res) => {
                if (!this.isCorrectResponse(res.statusCode ?? -1)) {
                    const error = new Error(res.statusMessage ?? 'Unknown error');
                    fail(error);
                    return;
                }
                res.setEncoding('utf8');
                let body = '';
                res.on('data', (data) => {
                    body += data;
                });
                res.on('end', () => {
                    resolve(JSON.parse(body));
                });
            });
            request.on('error', (error) => fail(error));
        });
    }
    isCorrectResponse(statusCode) {
        const correctRangeStart = 200;
        const correctRangeEnd = 299;
        return statusCode >= correctRangeStart && statusCode <= correctRangeEnd;
    }
}
