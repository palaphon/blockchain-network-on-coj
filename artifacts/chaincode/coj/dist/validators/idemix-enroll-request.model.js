"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var IdemixEnrollRequestModelValidator;
(function (IdemixEnrollRequestModelValidator) {
    function validate(enrollmentRequest) {
        const { verifyToken, votingID, publicKey, } = enrollmentRequest;
        if (!validator_1.ValidatorUtils.isStringValid(verifyToken)) {
            throw new not_valid_string_1.NotAValidStringError('verifyToken');
        }
        if (!validator_1.ValidatorUtils.isStringValid(votingID)) {
            throw new not_valid_string_1.NotAValidStringError('votingID');
        }
        if (!validator_1.ValidatorUtils.isStringValid(publicKey)) {
            throw new not_valid_string_1.NotAValidStringError('publicKey');
        }
    }
    IdemixEnrollRequestModelValidator.validate = validate;
})(IdemixEnrollRequestModelValidator = exports.IdemixEnrollRequestModelValidator || (exports.IdemixEnrollRequestModelValidator = {}));
//# sourceMappingURL=idemix-enroll-request.model.js.map