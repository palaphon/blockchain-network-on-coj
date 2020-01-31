import { VotingAsset, VotingGroup, VotingCandidate } from "../assets/voting";
export declare namespace VotingAssetValidator {
    function validate(asset: VotingAsset): void;
}
export declare namespace VotingGroupValidator {
    function validate(votingGroup: VotingGroup): void;
}
export declare namespace VotingCandidateValidator {
    function validate(candidate: VotingCandidate): void;
}
