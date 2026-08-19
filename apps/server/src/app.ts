import express, {type Application} from 'express';
import cors from 'cors';

const app: Application = express();

//global middleware

app.use(cors());
app.use(express.json());


// Nếu có REST API phụ (ví dụ webhook thanh toán, upload file) thì gắn ở đây
// app.use('/api/webhook', webhookRouter);

export default app;