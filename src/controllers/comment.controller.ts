import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { CommentService } from '@/services/comment.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class CommentController {
  public comment = Container.get(CommentService);

  public addCommentToPost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newsId = req.params.id as string;
      const userId = req.user.id;
      const text = req.body.text;
      const commets = await this.comment.addCommentsToPost({ data: { text, userId, newsId, createdAt: new Date(Date.now()).toISOString() } });

      res.status(200).json({ data: commets, message: 'create news' });
    } catch (error) {
      next(error);
    }
  };
}
