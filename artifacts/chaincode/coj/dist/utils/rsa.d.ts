import * as NodeRsa from 'node-rsa';
export declare namespace RsaUtils {
    function createRsaKeyString(): {
        privateKey: string;
        publicKey: string;
    };
    function importKeyString(key: string): NodeRsa;
    function encrypt(key: NodeRsa, data: string): string;
    function decrypt(key: NodeRsa, encryptedDataBase64: string): string;
    function decryptWithPublic(key: NodeRsa, encryptedDataBase64: string): string;
}
