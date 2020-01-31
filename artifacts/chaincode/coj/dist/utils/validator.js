"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorUtils;
(function (ValidatorUtils) {
    function isStringValid(str) {
        if (!str) {
            return false;
        }
        str = str.toString();
        if (str.trim().length === 0) {
            return false;
        }
        return true;
    }
    ValidatorUtils.isStringValid = isStringValid;
    function isArrayHasAtLeast1Member(arr) {
        if (!Array.isArray(arr)) {
            return false;
        }
        if (arr.length <= 0) {
            return false;
        }
        return true;
    }
    ValidatorUtils.isArrayHasAtLeast1Member = isArrayHasAtLeast1Member;
})(ValidatorUtils = exports.ValidatorUtils || (exports.ValidatorUtils = {}));
//# sourceMappingURL=validator.js.map