import { AuthService } from "../../domain/auth/auth.service";
import { User } from "../../infrastructure/models/user.model";
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    me(ctx: any): Promise<User>;
    allUsers(ctx: any): Promise<User[]>;
}
