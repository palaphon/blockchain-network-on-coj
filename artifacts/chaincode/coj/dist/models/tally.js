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
let TallyCandidateScore = class TallyCandidateScore {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], TallyCandidateScore.prototype, "candidateID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyCandidateScore.prototype, "score", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyCandidateScore.prototype, "order", void 0);
TallyCandidateScore = __decorate([
    fabric_contract_api_1.Object()
], TallyCandidateScore);
exports.TallyCandidateScore = TallyCandidateScore;
let TallyGroupStatistic = class TallyGroupStatistic {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyGroupStatistic.prototype, "usedRights", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyGroupStatistic.prototype, "unusedRights", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyGroupStatistic.prototype, "totalRights", void 0);
TallyGroupStatistic = __decorate([
    fabric_contract_api_1.Object()
], TallyGroupStatistic);
exports.TallyGroupStatistic = TallyGroupStatistic;
let TallyGroup = class TallyGroup {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], TallyGroup.prototype, "id", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], TallyGroup.prototype, "count", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", TallyGroupStatistic)
], TallyGroup.prototype, "statistics", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Array)
], TallyGroup.prototype, "candidateScores", void 0);
TallyGroup = __decorate([
    fabric_contract_api_1.Object()
], TallyGroup);
exports.TallyGroup = TallyGroup;
let Tally = class Tally {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Array)
], Tally.prototype, "groups", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", voting_1.VotingAsset)
], Tally.prototype, "votingInfo", void 0);
Tally = __decorate([
    fabric_contract_api_1.Object()
], Tally);
exports.Tally = Tally;
//# sourceMappingURL=tally.js.map