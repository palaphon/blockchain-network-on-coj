import { VotingAsset } from "../assets/voting";
export declare class TallyCandidateScore {
    candidateID: string;
    score: number;
    order: number;
}
export declare class TallyGroupStatistic {
    usedRights: number;
    unusedRights: number;
    totalRights: number;
}
export declare class TallyGroup {
    id: string;
    count: number;
    statistics: TallyGroupStatistic;
    candidateScores: TallyCandidateScore[];
}
export declare class Tally {
    groups: TallyGroup[];
    votingInfo: VotingAsset;
}
