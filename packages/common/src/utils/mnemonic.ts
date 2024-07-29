import { generateMnemonic } from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english';

export class Mnemonic {
  /**
     *
     * Creates a new password using words from a newly created bip39 mnemonic
     *
     * @returns string
     */
  public static createPassword(n: number = 6): string {
    const mnemonic = Mnemonic.createRecoveryPhrase().split(' ');
    const password: string[] = [];
    while (password.length < n && mnemonic.length > 0) {
      const randomIndex = Math.floor(Math.random() * mnemonic.length);
      password.push(mnemonic[randomIndex]);
      mnemonic.splice(randomIndex, 1);
    }
    return password.join(' ');
  }

  /**
     *
     * Creates a new bip39 mnemonic
     *
     * @returns string
     */
  public static createRecoveryPhrase(wordlist: string[] = english, strength: number = 128): string {
    return generateMnemonic(wordlist, strength);
  }
}