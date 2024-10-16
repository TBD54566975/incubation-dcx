var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authenticate } from '../../src/core/auth.js';
import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { expect } from 'chai';
import { DidDht, UniversalResolver } from '@web5/dids';
describe('Auth', () => {
    describe('authenticate()', () => {
        it('should throw if given JWS is `undefined`', () => __awaiter(void 0, void 0, void 0, function* () {
            const jws = undefined;
            yield expect(authenticate(jws, new UniversalResolver({ didResolvers: [DidDht] }))).to.be.rejectedWith(DwnErrorCode.AuthenticateJwsMissing);
        }));
    });
});
//# sourceMappingURL=auth.spec.js.map