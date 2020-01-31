import { VotingAsset, VotingGroup } from "../assets/voting";
import { Context } from "fabric-contract-api";
import { ConfirmTally } from "../models/confirm-tally";
import { TallyCandidateScore, TallyGroupStatistic } from "../models/tally";
export declare namespace VotingUtils {
    function getVoting(ctx: Context, votingID: string): Promise<{
        votingAssetKey: string;
        votingAsset: VotingAsset;
    }>;
    function getVotableVoting(ctx: Context, votingID: string): Promise<{
        votingAssetKey: string;
        votingAsset: VotingAsset;
    }>;
    function getVotableVotingAndPrivateKey(ctx: Context, votingID: string): Promise<{
        votingAssetKey: string;
        votingAsset: VotingAsset;
        privateKeyAssetKey: string;
        privateKeyString: string;
    }>;
    function deletePrivateKey(ctx: Context, votingID: string): Promise<void>;
    function comparePublicKeyAgainstToken(votingPrivateKeyString: string, userPublicKeyString: string, verifyToken: string): boolean;
    function getVotes(ctx: Context, votingID: string, groupID?: string, candidateID?: string, userPublicKeyString?: string): Promise<{
        key: string;
        value: unknown;
    }[]>;
    function getConfirmAssetsForVotingID(ctx: Context, votingID: string): Promise<{
        key: string;
        value: ConfirmTally;
    }[]>;
    function isVotingCanTally(ctx: Context, votingID: string): Promise<boolean>;
    function collecTallyGroupStatistic(votingAsset: VotingAsset, votingGroup: VotingGroup, tallyCandidateScores: TallyCandidateScore[]): TallyGroupStatistic;
    function sortCandidateScores(tallyCandidateScores: TallyCandidateScore[]): TallyCandidateScore[];
    function getCandidateScores(ctx: Context, votingAsset: VotingAsset, group: VotingGroup): Promise<TallyCandidateScore[]>;
    function putTallyConfirm(ctx: Context, votingID: string, commonName: string): Promise<void>;
}
