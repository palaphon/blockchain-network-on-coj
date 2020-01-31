import { Context } from "fabric-contract-api";
export declare namespace AssetKeyUtils {
    const VOTING_PRIVATEKEY_ASSET_KEY = "voting-privatekey-asset";
    const IDEMIX_REGISTER_ASSET_KEY = "idemix-register-asset";
    const VOTING_ASSET_KEY = "voting-asset";
    const VOTING_ENROLLMENT_ASSET_KEY = "voting-enrollment-asset";
    const VOTE_ASSET_KEY = "vote-asset";
    const TALLY_CONFIRM_ASSET_KEY = "tally-confirm-asset";
    function getVotingPrivateKeyCompositeKey(ctx: Context, votingID: string): string;
    function getVotingAssetCompositeKey(ctx: Context, votingID: string): string;
    function getVotingEnrollmentAssetCompositeKey(ctx: Context, votingID: string, userID: string): string;
    function getIdemixRegisterAssetCompositeKey(ctx: Context, votingID: string, userPublicKeyString: string): string;
    function getVoteAssetCompositeKey(ctx: Context, votingID: string, groupID: string, candidateID: string, userPublicKeyString: string, voteRightIndex: string): string;
    function getTallyConfirmAssetCompositeKey(ctx: Context, votingID: string, electionBoardUsername: string): string;
    function getPartialVoteAssetAttributes(votingID: string, groupID?: string, candidateID?: string, userPublicKeyString?: string, voteRightIndex?: string): string[];
    function getPartialTallyConfirmAssetAttributes(votingID: string): string[];
    function extractAttributes(ctx: Context, key: string): {
        type: string;
        attributes: string[];
    };
    function extractTallyConfirmAssetAttributes(ctx: Context, key: string): {
        votingID: string;
        electionBoardUsername: string;
    };
}
