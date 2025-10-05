import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CryptoHelper {
    getPasswordHash = async (password: string): Promise<string> => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    comparePasswords = async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
}