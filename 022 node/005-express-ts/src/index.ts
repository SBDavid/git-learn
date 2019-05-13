import * as express from 'express';

const app = express();
app.request
const port = 3000

app.use('/', (req: express.Request, res: express.Response) => res.send('jjdjdjd'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))