import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export class Mnemonic {
  /**
     *
     * Creates a new password using words from a newly created bip39 mnemonic
     *
     * @returns string
     */
  public static async createPassword(): Promise<string> {
    const mnemonic = generateMnemonic(wordlist, 128).split(' ');
    const words: string[] = [];
    for (let i = 0; i < 6; i++) {
      const rand = Math.floor(Math.random() * mnemonic.length);
      words.push(mnemonic[rand]);
    }
    return words.join(' ');
  }

  /**
     *
     * Creates a new bip39 mnemonic
     *
     * @returns string
     */
  public static async createRecoveryPhrase(): Promise<string> {
    return generateMnemonic(wordlist, 128);
  }
}