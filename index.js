import express , {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname,join} from 'path';
import {fileURLToPath} from 'url';
import useresRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';


dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {credentials:true, origin: 'http://localhost:3001'};
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use("/", express.static(join(__dirname, 'public')));
app.use('/api/users', useresRouter);
app.use('/api/auth', authRouter); 


app.listen(PORT, () => console.log(`server is listening on post ${PORT}`))