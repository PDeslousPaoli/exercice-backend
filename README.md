# exercice-backend
This repository contains the backend service for deputyTracker, built with Node.js + TypeScript and follows a Hexagonal Architecture. The API is GraphQL (code-first, auto-generated schema) and persistence is handled by Sequelize connected to a managed Aiven PostgreSQL instance.

Key workspace entry points:

Core service that builds payloads: VotesDeputesService — votes-deputes.service.ts
GraphQL resolver (primary adapter): DepsearchResolver — depsearch.resolver.ts
Database adapters (repositories): DeputeRepository, VoteRepository, VotesDeputesRepository

**Core / Domain**
Business logic is implemented inside domain services.
Domain errors are declared here: DeputeNotFoundError, VotesNotFoundError — depsearch.errors.ts.

**Ports**
Outbound port for votes-deputes use-case: IVotesDeputesService — votes-deputes.port.ts.
Outbound port for votes repository: IVoteRepository — vote.port.ts.

**Adapters**
Primary (driving) adapters: GraphQL resolvers. Main entry: DepsearchResolver.depute — depsearch.resolver.ts.
Secondary (driven) adapters: Sequelize repositories implementing ports:
DeputeRepository — deputes.repository.ts
VoteRepository — votes.repository.ts
VotesDeputesRepository — votes-deputes.repository.ts
Sequelize models (DB schema mapping): Votes_deputes, Votes, Deputes — votes-deputes.model.ts, votes.model.ts, deputes.model.ts.

**Tech Stack**
Runtime: Node.js + TypeScript
API: GraphQL (code-first via NestJS GraphQLModule; schema output: schema/schema.gql)
ORM: Sequelize (sequelize-typescript models)
Database: PostgreSQL (Aiven-managed)
CI/CD: GitHub Actions (workflow present in .github/workflows) and targeted deployment to Azure App Service (pipeline configured in repository).

**Local Setup & Installation**
**Prerequisites**

Node.js (v20+ recommended)
pnpm (npm install -g pnpm)
Clone and install
Environment (example .env entries)
Database (Aiven SSL): set connection variables used in database.config.ts and sequelize.config.js. Typical variables:
DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
Server: PORT=3000
Launch

**API Documentation (GraphQL)**
Schema is auto-generated from the code-first GraphQL types and resolvers and written to schema.gql.
The GraphQL server is configured in app.module.ts — see GraphQLModule.forRoot settings and context configuration: app.module.ts.
Primary GraphQL entry relevant to deputy search:

Resolver: DepsearchResolver.depute — depsearch.resolver.ts
DTO / GraphQL type returned: VoteDeputeDto — votes-deputes.ts
Example GraphQL query (use GraphQL Playground at http://localhost:3000/graphql when running):

**Core Functionalities** 
Ingest and persist deputy vote mappings

**Flow**:

Request hits DepsearchResolver.depute which orchestrates the domain flow.

Resolver calls VotesDeputesService.createPayload — votes-deputes.service.ts.

Inside the service:
The deputy is fetched via DeputeRepository.findDeputeByName — deputes.repository.ts. If not found, it throws DeputeNotFoundError — depsearch.errors.ts.

Votes involving the deputy are fetched via VoteRepository.findVotesByDeputeName — votes.repository.ts. If none are returned, the service throws VotesNotFoundError — depsearch.errors.ts.
For each vote, the service computes:
Normalized deputy name: normalizeName (removes accents, spaces, hyphens, lowercases). See VotesDeputesService.normalizeName — votes-deputes.service.ts.
Vote category: getVoteCategory (checks votants_pour, votants_contre, votants_abstention, non_votants). See VotesDeputesService.getVoteCategory — votes-deputes.service.ts.
The service maps votes into a payload matching the votes_deputes joint table and calls the Sequelize model bulk insert: this.votesDeputesModel.bulkCreate(...). The model mapping lives in Votes_deputes — votes-deputes.model.ts.
The service returns the depute id so the resolver can fetch results.

**Persistence details**:

Joint table model: Votes_deputes — votes-deputes.model.ts.
Migrations that create / enforce constraints on this table: 20250308-create-votes-deputes-joint-table.js and constraint update migration 20250824-make-composite-primary+key-for-vote-deputes-table.js.
Retrieve deputy vote payload for GraphQL queries
After ingesting or when requested, DepsearchService.retrievePayload — depsearch.service.ts queries stored mappings via VotesDeputesRepository.findAllDeputeVotes — votes-deputes.repository.ts.
If no stored votes exist for the deputy id, the service throws a NestJS NotFoundException to the resolver layer.
Other relevant parts

Vote model and arrays fields (postgres TEXT[] mapping): Votes — votes.model.ts. This model exposes arrays such as votants_pour, votants_contre, votants_abstention, and non_votants, and is used by the repository query in VoteRepository.findVotesByDeputeName — votes.repository.ts.
Unit tests that document expected behavior of the service: votes-deputes.service.spec.ts.

**Deployment**
CI/CD pipeline is configured under main_deputytracker.yml. Pushes to main trigger install/build/deploy steps targeting Azure App Service. See package.json for available scripts used by the pipeline.
