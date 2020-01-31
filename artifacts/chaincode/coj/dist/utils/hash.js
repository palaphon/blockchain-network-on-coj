"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
var HashUtils;
(function (HashUtils) {
    function createBase64Sha256Hash(message) {
        const sha256 = crypto.createHash('sha256');
        sha256.update(message);
        const sha256Base64 = sha256.digest('base64');
        return sha256Base64;
    }
    HashUtils.createBase64Sha256Hash = createBase64Sha256Hash;
})(HashUtils = exports.HashUtils || (exports.HashUtils = {}));
//# sourceMappingURL=hash.js.map