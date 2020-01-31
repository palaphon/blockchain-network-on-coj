"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var EnrollRequestModelValidator;
(function (EnrollRequestModelValidator) {
    function validate(enrollmentRequest) {
        const { verifyToken, votingID, } = enrollmentRequest;
        if (!validator_1.ValidatorUtils.isStringValid(verifyToken)) {
            throw new not_valid_string_1.NotAValidStringError('verifyToken');
        }
        if (!validator_1.ValidatorUtils.isStringValid(votingID)) {
            throw new not_valid_string_1.NotAValidStringError('votingID');
        }
    }
    EnrollRequestModelValidator.validate = validate;
})(EnrollRequestModelValidator = exports.EnrollRequestModelValidator || (exports.EnrollRequestModelValidator = {}));
//# sourceMappingURL=enroll-request.model.js.map