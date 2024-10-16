var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KEY_URI_PREFIX_JWK, isPrivateJwk } from '@web5/crypto';
import { Convert } from '@web5/common';
import { DwnInterface } from './types/dwn.js';
import { JwkProtocolDefinition } from './store-data-protocols.js';
import { TENANT_SEPARATOR } from './utils-internal.js';
import { DwnDataStore, InMemoryDataStore } from './store-data.js';
export class DwnKeyStore extends DwnDataStore {
    constructor() {
        super(...arguments);
        this.name = 'DwnKeyStore';
        this._recordProtocolDefinition = JwkProtocolDefinition;
        /**
         * Properties to use when writing and querying Private Key records with the DWN store.
         */
        this._recordProperties = {
            dataFormat: 'application/json',
            protocol: this._recordProtocolDefinition.protocol,
            protocolPath: 'privateJwk',
            schema: this._recordProtocolDefinition.types.privateJwk.schema,
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
            yield _super.set.call(this, params);
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
            // Query the DWN for all stored Jwk objects.
            const { reply: queryReply } = yield agent.dwn.processRequest({
                author: tenantDid,
                target: tenantDid,
                messageType: DwnInterface.RecordsQuery,
                messageParams: { filter: Object.assign({}, this._recordProperties) }
            });
            // Loop through all of the stored Jwk records and accumulate the objects.
            let storedKeys = [];
            for (const record of (_a = queryReply.entries) !== null && _a !== void 0 ? _a : []) {
                // All Jwk records are expected to be small enough such that the data is returned
                // with the query results. If a record is returned without `encodedData` this is unexpected so
                // throw an error.
                if (!record.encodedData) {
                    throw new Error(`${this.name}: Expected 'encodedData' to be present in the DWN query result entry`);
                }
                const storedKey = Convert.base64Url(record.encodedData).toObject();
                if (isPrivateJwk(storedKey)) {
                    // Update the index with the matching record ID.
                    const indexKey = `${tenantDid}${TENANT_SEPARATOR}${KEY_URI_PREFIX_JWK}${storedKey.kid}`;
                    this._index.set(indexKey, record.recordId);
                    // Add the stored key to the cache.
                    this._cache.set(record.recordId, storedKey);
                    storedKeys.push(storedKey);
                }
            }
            return storedKeys;
        });
    }
}
export class InMemoryKeyStore extends InMemoryDataStore {
    constructor() {
        super(...arguments);
        this.name = 'InMemoryKeyStore';
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
//# sourceMappingURL=store-key.js.map