"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_key_1 = require("./asset-key");
const asset_1 = require("./asset");
const date_time_1 = require("./date-time");
const private_data_1 = require("./private-data");
const rsa_1 = require("./rsa");
const hash_1 = require("./hash");
var VotingUtils;
(function (VotingUtils) {
    async function getVoting(ctx, votingID) {
        const votingAssetKey = asset_key_1.AssetKeyUtils.getVotingAssetCompositeKey(ctx, votingID);
        const votingAsset = await asset_1.AssetUtils.getAsset(ctx, votingAssetKey);
        if (!votingAsset) {
            throw new Error('Voting may not exists. Please check the enrollment request.');
        }
        return {
            votingAsset,
            votingAssetKey,
        };
    }
    VotingUtils.getVoting = getVoting;
    async function getVotableVoting(ctx, votingID) {
        const votingAssetKey = asset_key_1.AssetKeyUtils.getVotingAssetCompositeKey(ctx, votingID);
        const votingAsset = await asset_1.AssetUtils.getAsset(ctx, votingAssetKey);
        if (!votingAsset) {
            throw new Error('Voting may not exists. Please check the enrollment request.');
        }
        const { endDateTime, } = votingAsset;
        if (date_time_1.DateTimeUtils.isDateTimeReached(endDateTime)) {
            throw new Error('Voting expired.');
        }
        return {
            votingAsset,
            votingAssetKey,
        };
    }
    VotingUtils.getVotableVoting = getVotableVoting;
    async function getVotableVotingAndPrivateKey(ctx, votingID) {
        const votingAssetKey = asset_key_1.AssetKeyUtils.getVotingAssetCompositeKey(ctx, votingID);
        const votingAsset = await asset_1.AssetUtils.getAsset(ctx, votingAssetKey);
        if (!votingAsset) {
            throw new Error('Voting may not exists. Please check the enrollment request.');
        }
        const { endDateTime, } = votingAsset;
        if (date_time_1.DateTimeUtils.isDateTimeReached(endDateTime)) {
            throw new Error('Voting expired.');
        }
        const privateKeyAssetKey = asset_key_1.AssetKeyUtils.getVotingPrivateKeyCompositeKey(ctx, votingID);
        const privateKeyString = await private_data_1.PrivateDataUtils.getString(ctx, privateKeyAssetKey);
        if (!privateKeyString) {
            throw new Error('Private key is not exists. Voting is not valid for enrollment anymore.');
        }
        return {
            privateKeyAssetKey,
            privateKeyString,
            votingAsset,
            votingAssetKey,
        };
    }
    VotingUtils.getVotableVotingAndPrivateKey = getVotableVotingAndPrivateKey;
    async function deletePrivateKey(ctx, votingID) {
        const privateKeyAssetKey = asset_key_1.AssetKeyUtils.getVotingPrivateKeyCompositeKey(ctx, votingID);
        try {
            await private_data_1.PrivateDataUtils.deleteData(ctx, privateKeyAssetKey);
        }
        catch (e) { }
    }
    VotingUtils.deletePrivateKey = deletePrivateKey;
    function comparePublicKeyAgainstToken(votingPrivateKeyString, userPublicKeyString, verifyToken) {
        const votingPublicKey = rsa_1.RsaUtils.importKeyString(votingPrivateKeyString);
        const userPublicKeyHash = hash_1.HashUtils.createBase64Sha256Hash(userPublicKeyString);
        const decryptedUserPublicKeyHash = rsa_1.RsaUtils.decrypt(votingPublicKey, verifyToken);
        if (userPublicKeyHash !== decryptedUserPublicKeyHash) {
            return false;
        }
        return true;
    }
    VotingUtils.comparePublicKeyAgainstToken = comparePublicKeyAgainstToken;
    async function getVotes(ctx, votingID, groupID, candidateID, userPublicKeyString) {
        const voteAssetAttributes = asset_key_1.AssetKeyUtils.getPartialVoteAssetAttributes(votingID, groupID, candidateID, userPublicKeyString);
        const voteAssetPairs = await asset_1.AssetUtils.getPartialAsset(ctx, asset_key_1.AssetKeyUtils.VOTE_ASSET_KEY, voteAssetAttributes);
        return voteAssetPairs;
    }
    VotingUtils.getVotes = getVotes;
    async function getConfirmAssetsForVotingID(ctx, votingID) {
        const confirmAssetAttributes = asset_key_1.AssetKeyUtils.getPartialTallyConfirmAssetAttributes(votingID);
        const confirmAssetPairs = await asset_1.AssetUtils.getPartialAsset(ctx, asset_key_1.AssetKeyUtils.TALLY_CONFIRM_ASSET_KEY, confirmAssetAttributes);
        return confirmAssetPairs;
    }
    VotingUtils.getConfirmAssetsForVotingID = getConfirmAssetsForVotingID;
    async function isVotingCanTally(ctx, votingID) {
        const { votingAsset, } = await VotingUtils.getVoting(ctx, votingID);
        const { electionBoardUsernames, } = votingAsset;
        const confirmAssetPairs = await getConfirmAssetsForVotingID(ctx, votingID);
        let remainElectionBoardUsernames = [...electionBoardUsernames];
        for (const confirmAssetPair of confirmAssetPairs) {
            const { electionBoardUsername, } = asset_key_1.AssetKeyUtils.extractTallyConfirmAssetAttributes(ctx, confirmAssetPair.key);
            const matchedIndex = remainElectionBoardUsernames.indexOf(electionBoardUsername);
            if (matchedIndex !== -1) {
                remainElectionBoardUsernames = remainElectionBoardUsernames.splice(matchedIndex, 1);
            }
        }
        if (remainElectionBoardUsernames.length !== 0) {
            return false;
        }
        return true;
    }
    VotingUtils.isVotingCanTally = isVotingCanTally;
    function collecTallyGroupStatistic(votingAsset, votingGroup, tallyCandidateScores) {
        const totalRights = votingGroup.voteRights * votingAsset.voterUsernames.length;
        const usedRights = tallyCandidateScores.reduce((previousValue, candidateScore) => {
            return previousValue + candidateScore.score;
        }, 0);
        const unusedRights = totalRights - usedRights;
        return {
            totalRights,
            unusedRights,
            usedRights,
        };
    }
    VotingUtils.collecTallyGroupStatistic = collecTallyGroupStatistic;
    function sortCandidateScores(tallyCandidateScores) {
        if (tallyCandidateScores.length === 0) {
            return [];
        }
        tallyCandidateScores = tallyCandidateScores.sort((candidateA, candidateB) => {
            return candidateA.score - candidateB.score;
        });
        let order = 1;
        let minScore = tallyCandidateScores[0].score;
        for (const candidateScore of tallyCandidateScores) {
            if (candidateScore.score < minScore) {
                order += 1;
                minScore = candidateScore.score;
            }
            candidateScore.order = order;
        }
        return tallyCandidateScores;
    }
    VotingUtils.sortCandidateScores = sortCandidateScores;
    async function getCandidateScores(ctx, votingAsset, group) {
        const { id: groupID, candidates, name: groupName, } = group;
        const { id: votingID, } = votingAsset;
        let tallyCandidateScores = [];
        for (const candidate of candidates) {
            const { id: candidateID, } = candidate;
            const voteAssetPairs = await VotingUtils.getVotes(ctx, votingID, groupID, candidateID);
            const score = voteAssetPairs.length;
            const tallyCandidateScore = {
                candidateID,
                order: 0,
                score,
            };
            tallyCandidateScores.push(tallyCandidateScore);
        }
        tallyCandidateScores = sortCandidateScores(tallyCandidateScores);
        return tallyCandidateScores;
    }
    VotingUtils.getCandidateScores = getCandidateScores;
    async function putTallyConfirm(ctx, votingID, commonName) {
        const tallyConfirmKey = asset_key_1.AssetKeyUtils.getTallyConfirmAssetCompositeKey(ctx, votingID, commonName);
        if (await asset_1.AssetUtils.isAssetExists(ctx, tallyConfirmKey)) {
            throw new Error('This user is already confirm this voting.');
        }
        await asset_1.AssetUtils.putBlankAsset(ctx, tallyConfirmKey);
    }
    VotingUtils.putTallyConfirm = putTallyConfirm;
})(VotingUtils = exports.VotingUtils || (exports.VotingUtils = {}));
//# sourceMappingURL=voting.js.map