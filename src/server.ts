import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { PostRoute } from './routes/comment.route';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new PostRoute()]);

app.listen();
