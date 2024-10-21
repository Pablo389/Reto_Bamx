import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';

import userRoutes from './routes/userRoutes';

const app: Express = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});