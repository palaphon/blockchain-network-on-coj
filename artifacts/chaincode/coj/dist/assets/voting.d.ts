export declare class VotingCandidate {
    name: string;
    id: string;
}
export declare class VotingGroup {
    candidates: VotingCandidate[];
    name: string;
    id: string;
    voteRights: number;
    canVoteNo: boolean;
}
export declare class VotingAsset {
    id: string;
    startDateTime: string;
    endDateTime: string;
    groups: VotingGroup[];
    voterUsernames: string[];
    electionBoardUsernames: string[];
    publicKey?: string;
}
