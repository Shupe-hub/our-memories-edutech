import 'dotenv/config';
import app from './config/app.js';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in backend/.env.');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters.');
}

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
    console.log(`Our Memories EduTech API listening on port ${port}.`);
});
