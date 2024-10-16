import { BearerDid } from '@web5/dids';
import type { IdentityVaultBackup, IdentityVaultStatus, IdentityVaultParams, IdentityVault } from './types/identity-vault.js';
import { AgentCryptoApi } from './crypto-api.js';
/**
 * Extended initialization parameters for HdIdentityVault, including an optional recovery phrase
 * that can be used to derive keys to encrypt the vault and generate a DID.
 */
export type HdIdentityVaultInitializeParams = {
    /**
      * The password used to secure the vault.
      *
      * The password selected should be strong and securely managed to prevent unauthorized access.
      */
    password: string;
    /**
     * An optional recovery phrase used to derive the cryptographic keys for the vault.
     *
     * Providing a recovery phrase can be used to recover the vault's content or establish a
     * deterministic key generation scheme. If not provided, a new recovery phrase will be generated
     * during the initialization process.
     */
    recoveryPhrase?: string;
};
/**
 * The `HdIdentityVault` class provides secure storage and management of identity data.
 *
 * The `HdIdentityVault` class implements the `IdentityVault` interface, providing secure storage
 * and management of identity data with an added layer of security using Hierarchical Deterministic
 * (HD) key derivation based on the SLIP-0010 standard for Ed25519 keys. It enhances identity
 * protection by generating and securing the identity using a derived HD key, allowing for the
 * deterministic regeneration of keys from a recovery phrase.
 *
 * The vault is capable of:
 * - Secure initialization with a password and an optional recovery phrase, employing HD key
 *   derivation.
 * - Encrypting the identity data using a derived content encryption key (CEK) which is securely
 *   encrypted and stored, accessible only by the correct password.
 * - Securely backing up and restoring the vault’s contents, including the HD-derived keys and
 *   associated DID.
 * - Locking and unlocking the vault, which encrypts and decrypts the CEK for secure access to the
 *   vault's contents.
 * - Managing the DID associated with the identity, providing a secure identity layer for
 *   applications.
 *
 * Usage involves initializing the vault with a secure password (and optionally a recovery phrase),
 * which then allows for the secure storage, backup, and retrieval of the identity data.
 *
 * Note: Ensure the password is strong and securely managed, as it is crucial for the security of the
 * vault's encrypted contents.
 *
 * @example
 * ```typescript
 * const vault = new HdIdentityVault();
 * await vault.initialize({ password: 'secure-unique-phrase', recoveryPhrase: 'twelve words ...' });
 * const backup = await vault.backup();
 * await vault.restore({ backup, password: 'secure-unique-phrase' });
 * ```
 */
export declare class HdIdentityVault implements IdentityVault<{
    InitializeResult: string;
}> {
    /** Provides cryptographic functions needed for secure storage and management of the vault. */
    crypto: AgentCryptoApi;
    /** Determines the computational intensity of the key derivation process. */
    private _keyDerivationWorkFactor;
    /** The underlying key-value store for the vault's encrypted content. */
    private _store;
    /** The cryptographic key used to encrypt and decrypt the vault's content securely. */
    private _contentEncryptionKey;
    /**
     * Constructs an instance of `HdIdentityVault`, initializing the key derivation factor and data
     * store. It sets the default key derivation work factor and initializes the internal data store,
     * either with the provided store or a default in-memory store. It also establishes the initial
     * status of the vault as uninitialized and locked.
     *
     * @param params - Optional parameters when constructing a vault instance.
     * @param params.keyDerivationWorkFactor - Optionally set the computational effort for key derivation.
     * @param params.store - Optionally specify a custom key-value store for vault data.
     */
    constructor({ keyDerivationWorkFactor, store }?: IdentityVaultParams);
    /**
     * Creates a backup of the vault's current state, including the encrypted DID and content
     * encryption key, and returns it as an `IdentityVaultBackup` object. The backup includes a
     * Base64Url-encoded string representing the vault's encrypted data, encapsulating the
     * {@link PortableDid}, the content encryption key, and the vault's status.
     *
     * This method ensures that the vault is initialized and unlocked before proceeding with the
     * backup operation.
     *
     * @throws Error if the vault is not initialized or is locked, preventing the backup.
     * @returns A promise that resolves to the `IdentityVaultBackup` object containing the vault's
     *          encrypted backup data.
     */
    backup(): Promise<IdentityVaultBackup>;
    /**
     * Changes the password used to secure the vault.
     *
     * This method decrypts the existing content encryption key (CEK) with the old password, then
     * re-encrypts it with the new password, updating the vault's stored encrypted CEK. It ensures
     * that the vault is initialized and unlocks the vault if the password is successfully changed.
     *
     * @param params - Parameters required for changing the vault password.
     * @param params.oldPassword - The current password used to unlock the vault.
     * @param params.newPassword - The new password to replace the existing one.
     * @throws Error if the vault is not initialized or the old password is incorrect.
     * @returns A promise that resolves when the password change is complete.
     */
    changePassword({ oldPassword, newPassword }: {
        oldPassword: string;
        newPassword: string;
    }): Promise<void>;
    /**
     * Retrieves the DID (Decentralized Identifier) associated with the vault.
     *
     * This method ensures the vault is initialized and unlocked before decrypting and returning the
     * DID. The DID is stored encrypted and  is decrypted using the vault's content encryption key.
     *
     * @throws Error if the vault is not initialized, is locked, or the DID cannot be decrypted.
     * @returns A promise that resolves with a {@link BearerDid}.
     */
    getDid(): Promise<BearerDid>;
    /**
     * Fetches the current status of the `HdIdentityVault`, providing details on whether it's
     * initialized and the timestamps of the last backup and restore operations.
     *
     * @returns A promise that resolves with the current status of the `HdIdentityVault`, detailing
     *          its initialization, lock state, and the timestamps of the last backup and restore.
     */
    getStatus(): Promise<IdentityVaultStatus>;
    /**
     * Initializes the `HdIdentityVault` with a password and an optional recovery phrase.
     *
     * If a recovery phrase is not provided, a new one is generated. This process sets up the vault,
     * deriving the necessary cryptographic keys and preparing the vault for use. It ensures the vault
     * is ready to securely store and manage identity data.
     *
     * @example
     * ```ts
     * const identityVault = new HdIdentityVault();
     * const recoveryPhrase = await identityVault.initialize({
     *   password: 'your-secure-phrase'
     * });
     * console.log('Vault initialized. Recovery phrase:', recoveryPhrase);
     * ```
     *
     * @param params - The initialization parameters.
     * @param params.password - The password used to secure the vault.
     * @param params.recoveryPhrase - An optional 12-word recovery phrase for key derivation. If
     *                                omitted, a new recovery is generated.
     * @returns A promise that resolves with the recovery phrase used during the initialization, which
     *          should be securely stored by the user.
     */
    initialize({ password, recoveryPhrase }: HdIdentityVaultInitializeParams): Promise<string>;
    /**
     * Determines whether the vault has been initialized.
     *
     * This method checks the vault's current status to determine if it has been
     * initialized. Initialization is a prerequisite for most operations on the vault,
     * ensuring that it is ready for use.
     *
     * @example
     * ```ts
     * const isInitialized = await identityVault.isInitialized();
     * console.log('Is the vault initialized?', isInitialized);
     * ```
     *
     * @returns A promise that resolves to `true` if the vault has been initialized, otherwise `false`.
     */
    isInitialized(): Promise<boolean>;
    /**
     * Checks if the vault is currently locked.
     *
     * This method assesses the vault's current state to determine if it is locked.
     * A locked vault restricts access to its contents, requiring the correct password
     * to unlock and access the stored identity data. The vault must be unlocked to
     * perform operations that access or modify its contents.
     *
     * @example
     * ```ts
     * const isLocked = await identityVault.isLocked();
     * console.log('Is the vault locked?', isLocked);
     * ```
     *
     * @returns `true` if the vault is locked, otherwise `false`.
     */
    isLocked(): boolean;
    /**
     * Locks the `HdIdentityVault`, securing its contents by clearing the in-memory encryption key.
     *
     * This method ensures that the vault's sensitive data cannot be accessed without unlocking the
     * vault again with the correct password. It's an essential security feature for safeguarding
     * the vault's contents against unauthorized access.
     *
     * @example
     * ```ts
     * const identityVault = new HdIdentityVault();
     * await identityVault.lock();
     * console.log('Vault is now locked.');
     * ```
     * @throws An error if the identity vault has not been initialized.
     * @returns A promise that resolves when the vault is successfully locked.
     */
    lock(): Promise<void>;
    /**
     * Restores the vault's data from a backup object, decrypting and reinitializing the vault's
     * content with the provided backup data.
     *
     * This operation is crucial for data recovery scenarios, allowing users to regain access to their
     * encrypted data using a previously saved backup and their password.
     *
     * @example
     * ```ts
     * const identityVault = new HdIdentityVault();
     * await identityVault.initialize({ password: 'your-secure-phrase' });
     * // Create a backup of the vault's contents.
     * const backup = await identityVault.backup();
     * // Restore the vault with the same password.
     * await identityVault.restore({ backup: backup, password: 'your-secure-phrase' });
     * console.log('Vault restored successfully.');
     * ```
     *
     * @param params - The parameters required for the restore operation.
     * @param params.backup - The backup object containing the encrypted vault data.
     * @param params.password - The password used to encrypt the backup, necessary for decryption.
     * @returns A promise that resolves when the vault has been successfully restored.
     * @throws An error if the backup object is invalid or if the password is incorrect.
     */
    restore({ backup, password }: {
        backup: IdentityVaultBackup;
        password: string;
    }): Promise<void>;
    /**
     * Unlocks the vault by decrypting the stored content encryption key (CEK) using the provided
     * password.
     *
     * This method is essential for accessing the vault's encrypted contents, enabling the decryption
     * of stored data and the execution of further operations requiring the vault to be unlocked.
     *
     * @example
     * ```ts
     * const identityVault = new HdIdentityVault();
     * await identityVault.initialize({ password: 'your-initial-phrase' });
     * // Unlock the vault with the correct password before accessing its contents
     * await identityVault.unlock({ password: 'your-initial-phrase' });
     * console.log('Vault unlocked successfully.');
     * ```
     *
     *
     * @param params - The parameters required for the unlock operation.
     * @param params.password - The password used to encrypt the vault's CEK, necessary for
     *                            decryption.
     * @returns A promise that resolves when the vault has been successfully unlocked.
     * @throws An error if the vault has not been initialized or if the provided password is
     *         incorrect.
     */
    unlock({ password }: {
        password: string;
    }): Promise<void>;
    /**
     * Retrieves the Decentralized Identifier (DID) associated with the identity vault from the vault
     * store.
     *
     * This DID is encrypted in compact JWE format and needs to be decrypted after the vault is
     * unlocked. The method is intended to be used internally within the HdIdentityVault class to access
     * the encrypted PortableDid.
     *
     * @returns A promise that resolves to the encrypted DID stored in the vault as a compact JWE.
     * @throws Will throw an error if the DID cannot be retrieved from the vault.
     */
    private getStoredDid;
    /**
     * Retrieves the encrypted Content Encryption Key (CEK) from the vault's storage.
     *
     * This CEK is used for encrypting and decrypting the vault's contents. It is stored as a
     * compact JWE and should be decrypted with the user's password to be used for further
     * cryptographic operations.
     *
     * @returns A promise that resolves to the stored CEK as a string in compact JWE format.
     * @throws Will throw an error if the CEK cannot be retrieved, indicating potential issues with
     *         the vault's integrity or state.
     */
    private getStoredContentEncryptionKey;
    /**
     * Updates the status of the `HdIdentityVault`, reflecting changes in its initialization, lock
     * state, and the timestamps of the last backup and restore operations.
     *
     * This method directly manipulates the internal state stored in the vault's key-value store.
     *
     * @param params - The status properties to be updated.
     * @param params.initialized - Updates the initialization state of the vault.
     * @param params.lastBackup - Updates the timestamp of the last successful backup.
     * @param params.lastRestore - Updates the timestamp of the last successful restore.
     * @returns A promise that resolves to a boolean indicating successful status update.
     * @throws Will throw an error if the status cannot be updated in the key-value store.
     */
    private setStatus;
}
//# sourceMappingURL=hd-identity-vault.d.ts.map