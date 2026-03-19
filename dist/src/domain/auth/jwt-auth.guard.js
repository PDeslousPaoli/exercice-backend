"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
let JwtAuthGuard = class JwtAuthGuard {
    constructor() {
        this.issuer = process.env.AUTH0_ISSUER_BASE_URL;
        this.audience = process.env.AUTH0_AUDIENCE;
        this.jwksClient = jwksRsa({
            jwksUri: `${this.issuer}.well-known/jwks.json`,
            cache: true,
            rateLimit: true,
        });
    }
    async canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];
        if (!token)
            throw new common_1.UnauthorizedException("No token provided");
        const decodedHeader = jwt.decode(token, { complete: true });
        const kid = decodedHeader?.header.kid;
        if (!kid)
            throw new common_1.UnauthorizedException("Invalid token");
        const key = await this.jwksClient.getSigningKey(kid);
        const signingKey = key.getPublicKey();
        try {
            const decoded = jwt.verify(token, signingKey, {
                audience: this.audience,
                issuer: this.issuer,
                algorithms: ["RS256"],
            });
            req.user = decoded;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException("Token verification failed");
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map