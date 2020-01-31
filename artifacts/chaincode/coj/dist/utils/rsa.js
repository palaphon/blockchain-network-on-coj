"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRsa = require("node-rsa");
var RsaUtils;
(function (RsaUtils) {
    function createRsaKeyString() {
        const rsa = new NodeRsa({ b: 512 });
        const privateKeyString = rsa.exportKey('private');
        const publicKeyString = rsa.exportKey('public');
        return {
            privateKey: privateKeyString,
            publicKey: publicKeyString,
        };
    }
    RsaUtils.createRsaKeyString = createRsaKeyString;
    function importKeyString(key) {
        const rsa = new NodeRsa();
        rsa.importKey(key);
        return rsa;
    }
    RsaUtils.importKeyString = importKeyString;
    function encrypt(key, data) {
        const encrypted = key.encrypt(data, 'base64');
        return encrypted;
    }
    RsaUtils.encrypt = encrypt;
    function decrypt(key, encryptedDataBase64) {
        const decrypted = key.decrypt(encryptedDataBase64, 'utf8');
        return decrypted;
    }
    RsaUtils.decrypt = decrypt;
    function decryptWithPublic(key, encryptedDataBase64) {
        const decrypted = key.decryptPublic(encryptedDataBase64, 'utf8');
        return decrypted;
    }
    RsaUtils.decryptWithPublic = decryptWithPublic;
})(RsaUtils = exports.RsaUtils || (exports.RsaUtils = {}));
//# sourceMappingURL=rsa.js.map