import { Injectable } from '@nestjs/common';
import { DatabaseException } from 'src/common';
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
        }).catch((error) => {
            throw new DatabaseException('Failed to check user existence', [
                {
                    field: 'email',
                    message: `Unable to check user with this email | ${error.message}`,
                    value: email,
                },
            ]);
        });
    }

    // create user 
    createUser = async (data: { name: string; email: string; password: string }) => {
        const hashedPassword = await this.bcryptHelper.getPasswordHash(data.password);
        data.password = hashedPassword;
        return await this.prisma.user.create({
            data: data,
        }).catch((error) => {
            throw new DatabaseException('Failed to create user', [
                {
                    field: 'email',
                    message: `Unable to create user | ${error.message}`,
                    value: data.email,
                },
            ]);
        });
    }

    // update user
    updateUser = async (id: string, data: { name?: string; email?: string }) => {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: data,
            select: {
                name: true,
                email: true,
                createdAt: true,
                role: true,
            }
        }).catch((error) => {
            throw new DatabaseException('Failed to update user', [
                {
                    field: 'id',
                    message: `Unable to update user with this ID | ${error.message}`,
                    value: id,
                },
            ]);
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
            throw new DatabaseException('Failed to retrieve user', [
                {
                    field: 'id',
                    message: `Unable to retrieve user with this ID | ${error.message}`,
                    value: id,
                },
            ]);
        });
    }

    // delete user
    deleteUser = async (id: string) => {
        return await this.prisma.user.delete({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new DatabaseException('Failed to delete user', [
                {
                    field: 'id',
                    message: `Unable to delete user with this ID | ${error.message}`,
                    value: id,
                },
            ]);
        });
    }


}
