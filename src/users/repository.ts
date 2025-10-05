import { Injectable } from '@nestjs/common';
import { CryptoHelper } from 'src/common/helper/crypto.helper';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersRepository {
    constructor(
        private prisma: PrismaService,
        private bcryptHelper: CryptoHelper
    ) { }

    // check user already exist
    checkUserAlreadyExist = async (email: string) => {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    // create user 
    createUser = async (data: { name: string; email: string; password: string }) => {
        const hashedPassword = await this.bcryptHelper.getPasswordHash(data.password);
        data.password = hashedPassword;
        return await this.prisma.user.create({
            data: data,
        }).catch((error) => {
            throw error;
        });
    }

    // update user
    updateUser = async (id: string, data: { name?: string; email?: string; password?: string }) => {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: data,
        }).catch((error) => {
            throw error;
        });
    }

    //find by user ID;
    getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                email: true,
                createdAt: true,
                role: true,
            }
        }).catch((error) => {
            throw error;
        });
    }

    // delete user
    deleteUser = async (id: string) => {
        return await this.prisma.user.delete({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw error;
        });
    }


}
