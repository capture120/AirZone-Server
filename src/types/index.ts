import { User } from "../user/user-schema";

declare module '../../node_modules/@types/express-session' {
    interface SessionData {
        user: User;
    }
}