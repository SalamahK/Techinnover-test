import { Service } from 'typedi';

import { Prisma, PrismaClient } from '@prisma/client';
@Service()
export class CommentService {
  public comment = new PrismaClient().comment;

  public async addCommentsToPost(payload: Prisma.CommentCreateArgs): Promise<any> {
    const comment = await this.comment.create(payload);
    return comment;
  }
}
