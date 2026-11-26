import dotenv from 'dotenv';

// Local development uses its own ignored file. Railway supplies variables at
// runtime, so a production process never falls back to a developer's .env file.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.development' });
}
