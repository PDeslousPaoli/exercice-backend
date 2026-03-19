import { DepsearchService } from "../../domain/depsearch/depsearch.service";
import { VotesDeputesService } from "../../domain/depsearch/votes-deputes.service";
import { Logger } from "@nestjs/common";
import { VoteDeputeDto } from "domain/DTO/votes-deputes";
export type Depsearch = {
    vote_id: number;
    depute_id: number;
    vote_category: string;
    depute_nom: string;
    vote_titre: string;
};
export declare class DepsearchResolver {
    private depsearchService;
    private votesDeputeService;
    constructor(depsearchService: DepsearchService, votesDeputeService: VotesDeputesService);
    logger: typeof Logger;
    depute(deputeName: string): Promise<VoteDeputeDto[]>;
}
