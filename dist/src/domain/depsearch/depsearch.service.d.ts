import { VotesDeputesRepository } from "../../infrastructure/repositories/votes-deputes.repository";
import { Depsearch } from "../../presentation/resolvers/depsearch.resolver";
export declare class DepsearchService {
    private votesDeputesRepository;
    constructor(votesDeputesRepository: VotesDeputesRepository);
    retrievePayload(deputeId: number): Promise<Depsearch[]>;
}
