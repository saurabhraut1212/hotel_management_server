import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dbConnect from './db/dbconfig';
import 'dotenv/config';


import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoute";
import orderRoutes from "./routes/orderRoutes"

const app = express();


dbConnect();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



app.get('/', (req: Request, res: Response) => {
	res.send('Server started');
});


app.use('/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/order', orderRoutes);

const PORT:string | number = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});
