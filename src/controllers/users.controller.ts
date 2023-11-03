import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@prisma/client';
import { UserService } from '@services/users.service';
import { CreatePostDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public createPostForUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const news: CreatePostDto = req.body;
      const post = await this.user.createPost({ data: { authorId: user.id, ...news, createdAt: new Date(Date.now()).toISOString() } });
      res.status(200).json({ data: post, message: 'post created successfully' });
    } catch (err) {
      next(err);
    }
  };

  public retrievePostsForUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user.id;
      const posts = await this.user.retrieveUserPosts({ authorId });
      res.status(200).json({ data: posts, message: 'posts retrieved successfully' });
    } catch (err) {
      next(err);
    }
  };
}
