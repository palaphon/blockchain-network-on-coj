"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var GetTallyModelValidator;
(function (GetTallyModelValidator) {
    function validate(getTally) {
        const { votingID, } = getTally;
        if (!validator_1.ValidatorUtils.isStringValid(votingID)) {
            throw new not_valid_string_1.NotAValidStringError('votingID');
        }
    }
    GetTallyModelValidator.validate = validate;
})(GetTallyModelValidator = exports.GetTallyModelValidator || (exports.GetTallyModelValidator = {}));
//# sourceMappingURL=get-tally.model.js.map