var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Convert } from '@web5/common';
import { DwnInterface } from './types/dwn.js';
import { IdentityProtocolDefinition } from './store-data-protocols.js';
import { TENANT_SEPARATOR } from './utils-internal.js';
import { DwnDataStore, InMemoryDataStore } from './store-data.js';
export function isIdentityMetadata(obj) {
    // Validate that the given value is an object that has the necessary properties of IdentityMetadata.
    return !(!obj || typeof obj !== 'object' || obj === null)
        && 'name' in obj;
}
export class DwnIdentityStore extends DwnDataStore {
    constructor() {
        super(...arguments);
        this.name = 'DwnIdentityStore';
        this._recordProtocolDefinition = IdentityProtocolDefinition;
        /**
         * Properties to use when writing and querying Identity records with the DWN store.
         */
        this._recordProperties = {
            dataFormat: 'application/json',
            protocol: this._recordProtocolDefinition.protocol,
            protocolPath: 'identityMetadata',
            schema: this._recordProtocolDefinition.types.identityMetadata.schema,
        };
    }
    delete(params) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.delete.call(this, params);
        });
    }
    get(params) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.get.call(this, params);
        });
    }
    set(params) {
        const _super = Object.create(null, {
            set: { get: () => super.set }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.set.call(this, params);
        });
    }
    list(params) {
        const _super = Object.create(null, {
            list: { get: () => super.list }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.list.call(this, params);
        });
    }
    getAllRecords({ agent, tenantDid }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Clear the index since it will be rebuilt from the query results.
            this._index.clear();
            // Query the DWN for all stored IdentityMetadata objects.
            const { reply: queryReply } = yield agent.dwn.processRequest({
                author: tenantDid,
                target: tenantDid,
                messageType: DwnInterface.RecordsQuery,
                messageParams: { filter: Object.assign({}, this._recordProperties) }
            });
            // Loop through all of the stored IdentityMetadata records and accumulate the objects.
            let storedIdentities = [];
            for (const record of (_a = queryReply.entries) !== null && _a !== void 0 ? _a : []) {
                // All IdentityMetadata records are expected to be small enough such that the data is returned
                // with the query results. If a record is returned without `encodedData` this is unexpected so
                // throw an error.
                if (!record.encodedData) {
                    throw new Error(`${this.name}: Expected 'encodedData' to be present in the DWN query result entry`);
                }
                const storedIdentity = Convert.base64Url(record.encodedData).toObject();
                if (isIdentityMetadata(storedIdentity)) {
                    // Update the index with the matching record ID.
                    const indexKey = `${tenantDid}${TENANT_SEPARATOR}${storedIdentity.uri}`;
                    this._index.set(indexKey, record.recordId);
                    // Add the stored Identity to the cache.
                    this._cache.set(record.recordId, storedIdentity);
                    storedIdentities.push(storedIdentity);
                }
            }
            return storedIdentities;
        });
    }
}
export class InMemoryIdentityStore extends InMemoryDataStore {
    constructor() {
        super(...arguments);
        this.name = 'InMemoryIdentityStore';
    }
    delete(params) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.delete.call(this, params);
        });
    }
    get(params) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.get.call(this, params);
        });
    }
    list(params) {
        const _super = Object.create(null, {
            list: { get: () => super.list }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.list.call(this, params);
        });
    }
    set(params) {
        const _super = Object.create(null, {
            set: { get: () => super.set }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.set.call(this, params);
        });
    }
}
//# sourceMappingURL=store-identity.js.map