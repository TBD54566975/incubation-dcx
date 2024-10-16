/**
 * NOTE: Added reference types here to avoid a `pnpm` bug during build.
 * https://github.com/TBD54566975/web5-js/pull/507
 */
/// <reference types="@tbd54566975/dwn-sdk-js" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DwnInterface } from '@web5/agent';
/**
 * Encapsulates a DWN Protocol with its associated metadata and configuration.
 *
 * This class primarly exists to provide developers with a convenient way to configure/install
 * protocols on remote DWNs.
 */
export class Protocol {
    /**
     * Constructs a new instance of the Protocol class.
     *
     * @param agent - The Web5Agent instance used for network interactions.
     * @param protocolsConfigureMessage - The configuration message containing the protocol details.
     * @param metadata - Metadata associated with the protocol, including the author and optional message CID.
     */
    constructor(agent, protocolsConfigureMessage, metadata) {
        this._agent = agent;
        this._metadata = metadata;
        this._protocolsConfigureMessage = protocolsConfigureMessage;
    }
    /**
     * Retrieves the protocol definition from the protocol's configuration message.
     * @returns The protocol definition.
     */
    get definition() {
        return this._protocolsConfigureMessage.descriptor.definition;
    }
    /**
     * Serializes the protocol's configuration message to JSON.
     * @returns The serialized JSON object of the protocol's configuration message.
     */
    toJSON() {
        return this._protocolsConfigureMessage;
    }
    /**
     * Sends the protocol configuration to a remote DWN identified by the target DID.
     *
     * @param target - The DID of the target DWN to which the protocol configuration will be installed.
     * @returns A promise that resolves to an object containing the status of the send operation.
     */
    send(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reply } = yield this._agent.sendDwnRequest({
                author: this._metadata.author,
                messageCid: this._metadata.messageCid,
                messageType: DwnInterface.ProtocolsConfigure,
                target: target,
            });
            return { status: reply.status };
        });
    }
}
//# sourceMappingURL=protocol.js.map