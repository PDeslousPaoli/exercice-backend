import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class JwtAuthGuard implements CanActivate {
    private readonly issuer;
    private readonly audience;
    private jwksClient;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
