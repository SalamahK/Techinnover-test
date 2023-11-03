import { Router } from 'express';
import { CreateCommentDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { CommentController } from '@/controllers/comment.controller';

export class PostRoute implements Routes {
  public path = '/news';
  public router = Router();
  public comment = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/comments`, AuthMiddleware, ValidationMiddleware(CreateCommentDto),this.comment.addCommentToPost);
  }
}
