"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../utils/validator");
const date_time_1 = require("../utils/date-time");
const not_valid_string_1 = require("../errors/not-valid-string");
var VotingAssetValidator;
(function (VotingAssetValidator) {
    function validate(asset) {
        const { electionBoardUsernames, endDateTime, groups, id, startDateTime, voterUsernames, } = asset;
        if (!electionBoardUsernames ||
            !endDateTime ||
            !groups ||
            !id ||
            !startDateTime ||
            !voterUsernames) {
            throw new Error("Some VotingAsset field is missing.");
        }
        if (!validator_1.ValidatorUtils.isArrayHasAtLeast1Member(electionBoardUsernames)) {
            throw new Error('ElectionBoardUsernames must be an array that has at least 1 member.');
        }
        date_time_1.DateTimeUtils.getDateFromDateString(startDateTime);
        date_time_1.DateTimeUtils.getDateFromDateString(endDateTime);
        if (!validator_1.ValidatorUtils.isArrayHasAtLeast1Member(groups)) {
            throw new Error('Groups must be an array that has at least 1 member.');
        }
        const groupIDs = [];
        for (const group of groups) {
            VotingGroupValidator.validate(group);
            const groupID = group.id;
            if (groupIDs.indexOf(groupID) !== -1) {
                throw new Error('Duplicate group ID.');
            }
            groupIDs.push(groupID);
        }
        if (!validator_1.ValidatorUtils.isStringValid(id)) {
            throw new not_valid_string_1.NotAValidStringError('id');
        }
        if (!Array.isArray(voterUsernames)) {
            throw new Error('ElectionBoardUsernames must be an array.');
        }
        if (voterUsernames.length <= 0) {
            throw new Error('ElectionBoardUsernames must have at least 1 member.');
        }
    }
    VotingAssetValidator.validate = validate;
})(VotingAssetValidator = exports.VotingAssetValidator || (exports.VotingAssetValidator = {}));
var VotingGroupValidator;
(function (VotingGroupValidator) {
    function validate(votingGroup) {
        const { canVoteNo, candidates, id, name, voteRights, } = votingGroup;
        if (canVoteNo === null ||
            canVoteNo === undefined ||
            !candidates ||
            !id ||
            !name ||
            !voteRights) {
            throw new Error("Some VotingGroup field is missing.");
        }
        if (canVoteNo !== true && canVoteNo !== false) {
            throw new Error('VotingGroup canVoteNo must be boolean.');
        }
        if (!validator_1.ValidatorUtils.isArrayHasAtLeast1Member(candidates)) {
            throw new Error('VotingGroup Candidates must be an array that has at least 1 member.');
        }
        const candidateIDs = [];
        for (const candidate of candidates) {
            VotingCandidateValidator.validate(candidate);
            const candidateID = candidate.id;
            if (candidateIDs.indexOf(candidateID) !== -1) {
                throw new Error('Duplicate candidate ID in same votingGroup.');
            }
            candidateIDs.push(candidateID);
        }
        if (!validator_1.ValidatorUtils.isStringValid(id)) {
            throw new not_valid_string_1.NotAValidStringError('VotingGroup ID');
        }
        if (validator_1.ValidatorUtils.isStringValid(name)) {
            throw new not_valid_string_1.NotAValidStringError('VotingGroup name.');
        }
        if (voteRights <= 0) {
            throw new Error('VotingGroup voteRights must greater than or equals to 1.');
        }
    }
    VotingGroupValidator.validate = validate;
})(VotingGroupValidator = exports.VotingGroupValidator || (exports.VotingGroupValidator = {}));
var VotingCandidateValidator;
(function (VotingCandidateValidator) {
    function validate(candidate) {
        const { id, name, } = candidate;
        if (!id ||
            !name) {
            throw new Error('Some VotingCandidate field is missing.');
        }
        if (!validator_1.ValidatorUtils.isStringValid(id)) {
            throw new not_valid_string_1.NotAValidStringError('VotingCandidate ID');
        }
        if (!validator_1.ValidatorUtils.isStringValid(name)) {
            throw new not_valid_string_1.NotAValidStringError('VotingCandidate name');
        }
    }
    VotingCandidateValidator.validate = validate;
})(VotingCandidateValidator = exports.VotingCandidateValidator || (exports.VotingCandidateValidator = {}));
//# sourceMappingURL=voting.asset.js.map