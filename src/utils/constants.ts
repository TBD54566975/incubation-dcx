import { config } from "../index.js";

export const DWN_PASSWORD_WARNING = `SECURITY WARNING: You have not set a DWN_PASSWORD, one will be generated for you and saved to ${config.DCX_SECRETS_FILEPATH}`;

export const DWN_RECOVERY_PHRASE_WARNING = `SECURITY WARNING: You have not set a DWN_RECOVERY_PHRASE, one will be generated for you and saved to ${config.DCX_SECRETS_FILEPATH}`;

export const CIPHER_KEY_WARNING = `SECURITY WARNING: You have not set a CIPHER_KEY, one will be generated for you and saved to ${config.DCX_SECRETS_FILEPATH}`;

export const trustedIssuers = [
  {
    name: 'mx',
    did: 'did:dht:sa713dw7jyg44ejwcdf8iqcseh7jcz51wj6fjxbooj41ipeg76eo',
  },
];
