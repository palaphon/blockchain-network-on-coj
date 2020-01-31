"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var ConfirmTallyModelValidator;
(function (ConfirmTallyModelValidator) {
    function validate(confirmTally) {
        const { votingID, } = confirmTally;
        if (!validator_1.ValidatorUtils.isStringValid(votingID)) {
            throw new not_valid_string_1.NotAValidStringError('votingID');
        }
    }
    ConfirmTallyModelValidator.validate = validate;
})(ConfirmTallyModelValidator = exports.ConfirmTallyModelValidator || (exports.ConfirmTallyModelValidator = {}));
//# sourceMappingURL=confirm-tally.model.js.map