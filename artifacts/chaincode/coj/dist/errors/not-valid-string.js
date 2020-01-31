"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotAValidStringError extends Error {
    constructor(variableName) {
        super(`${variableName} is not a valid string.`);
    }
}
exports.NotAValidStringError = NotAValidStringError;
//# sourceMappingURL=not-valid-string.js.map