import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const verifyToken = (token: string, secret: Secret): JwtPayload | null => {
    try {

        // Verify the token using the provided secret key
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};