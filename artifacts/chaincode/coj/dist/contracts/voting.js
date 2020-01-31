"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const voting_1 = require("../assets/voting");
const asset_key_1 = require("../utils/asset-key");
const asset_1 = require("../utils/asset");
const rsa_1 = require("../utils/rsa");
const private_data_1 = require("../utils/private-data");
const identity_1 = require("../utils/identity");
const voting_asset_1 = require("../validators/voting.asset");
const enroll_request_1 = require("../models/enroll-request");
const enroll_request_model_1 = require("../validators/enroll-request.model");
const date_time_1 = require("../utils/date-time");
const idemix_enroll_request_1 = require("../models/idemix-enroll-request");
const idemix_enroll_request_model_1 = require("../validators/idemix-enroll-request.model");
const voting_2 = require("../utils/voting");
const vote_1 = require("../models/vote");
const vote_model_1 = require("../validators/vote.model");
const confirm_tally_1 = require("../models/confirm-tally");
const confirm_tally_model_1 = require("../validators/confirm-tally.model");
const get_tally_1 = require("../models/get-tally");
const get_voting_1 = require("../models/get-voting");
let VotingContract = class VotingContract extends fabric_contract_api_1.Contract {
    async instantiate(ctx) {
        const { stub } = ctx;
        const initAssetKey = stub.createCompositeKey('init-asset', ['init']);
        asset_1.AssetUtils.putBlankAsset(ctx, initAssetKey);
        return {};
    }
    async createVoting(ctx, newVotingAsset) {
        // Require Admin
        if (!identity_1.IdentityUtils.isCallerHasRoleAdmin(ctx)) {
            throw new Error('This contract requires with admin role from permitted organization.');
        }
        voting_asset_1.VotingAssetValidator.validate(newVotingAsset);
        const { id: newVotingID, } = newVotingAsset;
        const assetKey = asset_key_1.AssetKeyUtils.getVotingAssetCompositeKey(ctx, newVotingID);
        if (await asset_1.AssetUtils.isAssetExists(ctx, assetKey)) {
            throw new Error('Voting is already exists.');
        }
        const votingPrivateKeyKey = asset_key_1.AssetKeyUtils.getVotingPrivateKeyCompositeKey(ctx, newVotingID);
        const { privateKey, publicKey, } = rsa_1.RsaUtils.createRsaKeyString();
        await private_data_1.PrivateDataUtils.putString(ctx, votingPrivateKeyKey, privateKey);
        newVotingAsset.publicKey = publicKey;
        await asset_1.AssetUtils.putAsset(ctx, assetKey, newVotingAsset);
    }
    async getVoting(ctx, request) {
        const { votingID, } = request;
        const voting = voting_2.VotingUtils.getVoting(ctx, votingID);
        return voting;
    }
    async markEnroll(ctx, request) {
        if (identity_1.IdentityUtils.isCallerHasRoleAdmin(ctx)) {
            throw new Error('This transaction can\'t invoke by admin. It must be processed with voter user.');
        }
        enroll_request_model_1.EnrollRequestModelValidator.validate(request);
        const { verifyToken, votingID, } = request;
        const { votingAsset, privateKeyString, } = await voting_2.VotingUtils.getVotableVotingAndPrivateKey(ctx, votingID);
        const voters = votingAsset.voterUsernames;
        const commonName = identity_1.IdentityUtils.getCallerCommonName(ctx);
        if (voters.indexOf(commonName) === -1) {
            throw new Error('Can\'t find caller username as eligable for this voting.');
        }
        const votingEnrollAssetKey = asset_key_1.AssetKeyUtils.getVotingEnrollmentAssetCompositeKey(ctx, votingID, commonName);
        if (await asset_1.AssetUtils.isAssetExists(ctx, votingEnrollAssetKey)) {
            throw new Error('User is already enrolled.');
        }
        await asset_1.AssetUtils.putBlankAsset(ctx, votingEnrollAssetKey);
        const votingKey = rsa_1.RsaUtils.importKeyString(privateKeyString);
        const encrypted = rsa_1.RsaUtils.encrypt(votingKey, verifyToken);
        return {
            signedToken: encrypted,
        };
    }
    async markIdemixEnroll(ctx, request) {
        if (identity_1.IdentityUtils.isCallerHasRoleAdmin(ctx)) {
            throw new Error('This transaction can\'t invoke by admin. It must be processed with voter user.');
        }
        idemix_enroll_request_model_1.IdemixEnrollRequestModelValidator.validate(request);
        const { verifyToken, votingID, publicKey: userPublicKeyString, } = request;
        const { votingAsset, privateKeyString, } = await voting_2.VotingUtils.getVotableVotingAndPrivateKey(ctx, votingID);
        if (!voting_2.VotingUtils.comparePublicKeyAgainstToken(privateKeyString, userPublicKeyString, verifyToken)) {
            throw new Error('Verify token is not valid.');
        }
        const idemixRegisterKey = asset_key_1.AssetKeyUtils.getIdemixRegisterAssetCompositeKey(ctx, votingID, userPublicKeyString);
        if (await asset_1.AssetUtils.isAssetExists(ctx, idemixRegisterKey)) {
            throw new Error('This user is already registered.');
        }
        const idemixRegisterAsset = {
            groupRightsLeft: {},
        };
        for (const group of votingAsset.groups) {
            idemixRegisterAsset.groupRightsLeft[group.id] = group.voteRights;
        }
        asset_1.AssetUtils.putAsset(ctx, idemixRegisterKey, idemixRegisterAsset);
    }
    async createVote(ctx, newVote) {
        if (identity_1.IdentityUtils.isCallerHasRoleAdmin(ctx)) {
            throw new Error('This transaction can\'t invoke by admin. It must be processed with voter user.');
        }
        vote_model_1.VoteModelValidator.validate(newVote);
        const { candidateID, groupID, userPublicKey: userPublicKeyString, verifyToken, votingID, } = newVote;
        const { votingAsset, privateKeyString, } = await voting_2.VotingUtils.getVotableVotingAndPrivateKey(ctx, votingID);
        if (!date_time_1.DateTimeUtils.isDateTimeReached(votingAsset.startDateTime)) {
            throw new Error('Vote is not begin yet.');
        }
        if (!voting_2.VotingUtils.comparePublicKeyAgainstToken(privateKeyString, userPublicKeyString, verifyToken)) {
            throw new Error('Verify token is not valid.');
        }
        const idemixRegisterKey = asset_key_1.AssetKeyUtils.getIdemixRegisterAssetCompositeKey(ctx, votingID, userPublicKeyString);
        const idemixRegisterAsset = await asset_1.AssetUtils.getAsset(ctx, idemixRegisterKey);
        const { groupRightsLeft, } = idemixRegisterAsset;
        const voteRightIndex = groupRightsLeft[groupID];
        if (!voteRightIndex) {
            throw new Error('Group ID does not exists or user does not have right to vote on specified group.');
        }
        if (voteRightIndex < 1) {
            throw new Error('User does not have any rights left for this group.');
        }
        let matched = false;
        for (const group of votingAsset.groups) {
            if (group.id === groupID) {
                for (const candidate of group.candidates) {
                    if (candidate.id === candidateID) {
                        matched = true;
                        break;
                    }
                }
                break;
            }
        }
        if (!matched) {
            throw new Error('CandidateID is not valid.');
        }
        idemixRegisterAsset.groupRightsLeft[groupID] -= 1;
        try {
            await asset_1.AssetUtils.putAsset(ctx, idemixRegisterKey, idemixRegisterAsset);
            const votingKey = asset_key_1.AssetKeyUtils.getVoteAssetCompositeKey(ctx, votingID, groupID, candidateID, userPublicKeyString, voteRightIndex.toString());
            await asset_1.AssetUtils.putBlankAsset(ctx, votingKey);
        }
        catch (e) {
            // Revert
            idemixRegisterAsset.groupRightsLeft[groupID] += 1;
            await asset_1.AssetUtils.putAsset(ctx, idemixRegisterKey, idemixRegisterAsset);
            throw e;
        }
    }
    async confirmTally(ctx, request) {
        if (identity_1.IdentityUtils.isCallerHasRoleAdmin(ctx)) {
            throw new Error('This transaction can\'t invoke by admin. It must be processed with voter user.');
        }
        confirm_tally_model_1.ConfirmTallyModelValidator.validate(request);
        const { votingID, } = request;
        const { votingAsset, } = await voting_2.VotingUtils.getVoting(ctx, votingID);
        const { electionBoardUsernames, } = votingAsset;
        const commonName = identity_1.IdentityUtils.getCallerCommonName(ctx);
        if (electionBoardUsernames.indexOf(commonName) === -1) {
            throw new Error('User does not have right to confirm this voting.');
        }
        await voting_2.VotingUtils.putTallyConfirm(ctx, votingID, commonName);
        if (await voting_2.VotingUtils.isVotingCanTally(ctx, votingID)) {
            await voting_2.VotingUtils.deletePrivateKey(ctx, votingID);
        }
    }
    async getTally(ctx, request) {
        console.log(request);
        confirm_tally_model_1.ConfirmTallyModelValidator.validate(request);
        const { votingID, } = request;
        const { votingAsset, } = await voting_2.VotingUtils.getVoting(ctx, votingID);
        if (!await voting_2.VotingUtils.isVotingCanTally(ctx, votingID)) {
            throw new Error('All required election board did not confirm yet.');
        }
        const { groups, } = votingAsset;
        const tallyGroups = [];
        for (const group of groups) {
            const { id: groupID, } = group;
            let candidateScores = await voting_2.VotingUtils.getCandidateScores(ctx, votingAsset, group);
            const tallyGroupStatistic = voting_2.VotingUtils.collecTallyGroupStatistic(votingAsset, group, candidateScores);
            tallyGroups.push({
                candidateScores,
                count: tallyGroupStatistic.usedRights,
                id: groupID,
                statistics: tallyGroupStatistic,
            });
        }
        return {
            groups: tallyGroups,
            votingInfo: votingAsset,
        };
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "instantiate", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        voting_1.VotingAsset]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "createVoting", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, get_voting_1.GetVoting]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "getVoting", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        enroll_request_1.EnrollRequest]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "markEnroll", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        idemix_enroll_request_1.IdemixEnrollRequest]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "markIdemixEnroll", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        vote_1.VoteModel]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "createVote", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        confirm_tally_1.ConfirmTally]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "confirmTally", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context,
        get_tally_1.GetTally]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "getTally", null);
VotingContract = __decorate([
    fabric_contract_api_1.Info({ title: 'VotingContract', description: 'My Smart Contract' })
], VotingContract);
exports.VotingContract = VotingContract;
//# sourceMappingURL=voting.js.map