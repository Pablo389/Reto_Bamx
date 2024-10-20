import express, {Express, Request, Response} from 'express';

const app: Express = express();

const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});