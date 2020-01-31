import { Context, Contract } from 'fabric-contract-api';
import { VotingAsset } from '../assets/voting';
import { SignedToken } from '../models/signed-token';
import { EnrollRequest } from '../models/enroll-request';
import { IdemixEnrollRequest } from '../models/idemix-enroll-request';
import { VoteModel } from '../models/vote';
import { ConfirmTally } from '../models/confirm-tally';
import { GetTally } from '../models/get-tally';
import { Tally } from '../models/tally';
import { GetVoting } from '../models/get-voting';
export declare class VotingContract extends Contract {
    instantiate(ctx: Context): Promise<{}>;
    createVoting(ctx: Context, newVotingAsset: VotingAsset): Promise<void>;
    getVoting(ctx: Context, request: GetVoting): Promise<{
        votingAssetKey: string;
        votingAsset: VotingAsset;
    }>;
    markEnroll(ctx: Context, request: EnrollRequest): Promise<SignedToken>;
    markIdemixEnroll(ctx: Context, request: IdemixEnrollRequest): Promise<void>;
    createVote(ctx: Context, newVote: VoteModel): Promise<void>;
    confirmTally(ctx: Context, request: ConfirmTally): Promise<void>;
    getTally(ctx: Context, request: GetTally): Promise<Tally>;
}
