import { AuthService } from "../../domain/authentification/auth.service";
import { SignupInput } from "../../domain/DTO/signup.input";
import { User } from "../../models/user.model";
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    signup(data: SignupInput): Promise<User>;
}
