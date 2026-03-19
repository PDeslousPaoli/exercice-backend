import { User } from "../../infrastructure/models/user.model";
export declare class AuthService {
    private userModel;
    constructor(userModel: typeof User);
    findOrCreateUser(decodedJwt: {
        sub: string;
        email: string;
        [key: string]: any;
    }): Promise<User>;
    getUserById(id: number): Promise<User>;
}
