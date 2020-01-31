"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var VoteModelValidator;
(function (VoteModelValidator) {
    function validate(voteModel) {
        const { candidateID, groupID, } = voteModel;
        if (!validator_1.ValidatorUtils.isStringValid(candidateID)) {
            throw new not_valid_string_1.NotAValidStringError('candidateID');
        }
        if (!validator_1.ValidatorUtils.isStringValid(groupID)) {
            throw new not_valid_string_1.NotAValidStringError('groupID');
        }
    }
    VoteModelValidator.validate = validate;
})(VoteModelValidator = exports.VoteModelValidator || (exports.VoteModelValidator = {}));
//# sourceMappingURL=vote.model.js.map