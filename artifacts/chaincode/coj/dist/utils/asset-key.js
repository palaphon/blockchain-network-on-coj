"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetKeyUtils;
(function (AssetKeyUtils) {
    AssetKeyUtils.VOTING_PRIVATEKEY_ASSET_KEY = 'voting-privatekey-asset';
    AssetKeyUtils.IDEMIX_REGISTER_ASSET_KEY = 'idemix-register-asset';
    AssetKeyUtils.VOTING_ASSET_KEY = 'voting-asset';
    AssetKeyUtils.VOTING_ENROLLMENT_ASSET_KEY = 'voting-enrollment-asset';
    AssetKeyUtils.VOTE_ASSET_KEY = 'vote-asset';
    AssetKeyUtils.TALLY_CONFIRM_ASSET_KEY = 'tally-confirm-asset';
    function getVotingPrivateKeyCompositeKey(ctx, votingID) {
        const { stub, } = ctx;
        const attributes = [votingID];
        return stub.createCompositeKey(AssetKeyUtils.VOTING_PRIVATEKEY_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getVotingPrivateKeyCompositeKey = getVotingPrivateKeyCompositeKey;
    function getVotingAssetCompositeKey(ctx, votingID) {
        const { stub } = ctx;
        const attributes = [votingID];
        return stub.createCompositeKey(AssetKeyUtils.VOTING_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getVotingAssetCompositeKey = getVotingAssetCompositeKey;
    function getVotingEnrollmentAssetCompositeKey(ctx, votingID, userID) {
        const { stub, } = ctx;
        const attributes = [votingID, userID];
        return stub.createCompositeKey(AssetKeyUtils.VOTING_ENROLLMENT_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getVotingEnrollmentAssetCompositeKey = getVotingEnrollmentAssetCompositeKey;
    function getIdemixRegisterAssetCompositeKey(ctx, votingID, userPublicKeyString) {
        const { stub, } = ctx;
        const attributes = [votingID, userPublicKeyString];
        return stub.createCompositeKey(AssetKeyUtils.IDEMIX_REGISTER_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getIdemixRegisterAssetCompositeKey = getIdemixRegisterAssetCompositeKey;
    function getVoteAssetCompositeKey(ctx, votingID, groupID, candidateID, userPublicKeyString, voteRightIndex) {
        const { stub, } = ctx;
        const attributes = [votingID, groupID, candidateID, userPublicKeyString, voteRightIndex];
        return stub.createCompositeKey(AssetKeyUtils.VOTE_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getVoteAssetCompositeKey = getVoteAssetCompositeKey;
    function getTallyConfirmAssetCompositeKey(ctx, votingID, electionBoardUsername) {
        const { stub, } = ctx;
        const attributes = [votingID, electionBoardUsername];
        return stub.createCompositeKey(AssetKeyUtils.TALLY_CONFIRM_ASSET_KEY, attributes);
    }
    AssetKeyUtils.getTallyConfirmAssetCompositeKey = getTallyConfirmAssetCompositeKey;
    function getPartialVoteAssetAttributes(votingID, groupID, candidateID, userPublicKeyString, voteRightIndex) {
        const attributes = [
            votingID,
            groupID,
            candidateID,
            userPublicKeyString,
            voteRightIndex,
        ];
        return attributes.filter(a => !!a);
    }
    AssetKeyUtils.getPartialVoteAssetAttributes = getPartialVoteAssetAttributes;
    function getPartialTallyConfirmAssetAttributes(votingID) {
        const attributes = [votingID];
        return attributes;
    }
    AssetKeyUtils.getPartialTallyConfirmAssetAttributes = getPartialTallyConfirmAssetAttributes;
    function extractAttributes(ctx, key) {
        const { stub } = ctx;
        const splited = stub.splitCompositeKey(key);
        return {
            type: splited.objectType,
            attributes: splited.attributes,
        };
    }
    AssetKeyUtils.extractAttributes = extractAttributes;
    function extractTallyConfirmAssetAttributes(ctx, key) {
        const { type, attributes: [votingID, electionBoardUsername], } = extractAttributes(ctx, key);
        return {
            votingID,
            electionBoardUsername,
        };
    }
    AssetKeyUtils.extractTallyConfirmAssetAttributes = extractTallyConfirmAssetAttributes;
})(AssetKeyUtils = exports.AssetKeyUtils || (exports.AssetKeyUtils = {}));
//# sourceMappingURL=asset-key.js.map