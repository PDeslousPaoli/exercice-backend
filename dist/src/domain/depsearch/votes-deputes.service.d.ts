import { Votes_deputes } from "../../infrastructure/models/votes-deputes.model";
import { DeputeRepository } from "../../infrastructure/repositories/deputes.repository";
import { VoteRepository } from "../../infrastructure/repositories/votes.repository";
import { IVotesDeputesService } from "../ports/votes-deputes.port";
export declare class VotesDeputesService implements IVotesDeputesService {
    private votesDeputesModel;
    private deputeRepository;
    private voteRepository;
    constructor(votesDeputesModel: typeof Votes_deputes, deputeRepository: DeputeRepository, voteRepository: VoteRepository);
    createPayload(deputeName: string): Promise<number>;
    private normalizeName;
    private getVoteCategory;
}
