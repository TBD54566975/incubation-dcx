import { expect } from 'chai';
import { messageReplyFromError } from '../../src/core/message-reply.js';
describe('Message Reply', () => {
    it('handles non-Errors being thrown', () => {
        let response;
        try {
            throw 'Some error message';
        }
        catch (e) {
            response = messageReplyFromError(e, 500);
        }
        expect(response.status.code).to.eq(500);
        expect(response.status.detail).to.eq('Error');
    });
});
//# sourceMappingURL=message-reply.spec.js.map