import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '../exceptions/HttpException';

import { News, Prisma, PrismaClient, User } from '@prisma/client';
@Service()
export class UserService {
  public user = new PrismaClient().user;
  public post = new PrismaClient().news;

  public async findAllUser(): Promise<any> {
    const allUser = await this.user.findMany({
      take: 3,
      orderBy: {
        news: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        email: true,
        news: true,
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            text: true,
            createdAt: true,
          },
        },
      },
    });
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.user.create({ data: { ...userData, password: hashedPassword } });
    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { id: userId } });
    return deleteUserData;
  }

  public async createPost(payload: Prisma.NewsCreateArgs): Promise<News> {
    const post = await this.post.create(payload);
    return post;
  }

  public async retrieveUserPosts(payload: Prisma.NewsWhereInput): Promise<News[]> {
    const posts = await this.post.findMany({ where: payload });
    return posts;
  }
}
