var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Ajv from 'ajv';
import definitions from '../../../json-schemas/definitions.json' assert { type: 'json' };
import { expect } from 'chai';
describe('date-time schema', () => __awaiter(void 0, void 0, void 0, function* () {
    const ajv = new Ajv.default();
    const validateDateTime = ajv.compile(definitions.$defs['date-time']);
    it('should accept ISO 8601 date-time strings accepted by DWN', () => {
        expect(validateDateTime('2022-04-29T10:30:00.123456Z')).to.be.true;
    });
    it('should reject ISO 8601 date-time strings not accepted by DWN', () => {
        const unacceptableDateTimeStrings = [
            '2023-04-27T13:30:00.123456',
            '2023-04-27T13:30:00.123456z',
            '2023-04-27T13:30:00.1234Z',
            '2023-04-27T13:30:00Z',
            '2023-04-27T13:30:00.000000+00:00',
            '2023-04-27 13:30:00.000000Z'
        ];
        for (const dateTime of unacceptableDateTimeStrings) {
            expect(validateDateTime(dateTime)).to.be.false;
        }
    });
}));
//# sourceMappingURL=definitions.spec.js.map