import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('.env.local not found!');
            return;
        }
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envFile.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim(); // Handle values with =
                envVars[key] = value;
            }
        });

        const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
        const key = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

        if (!url || !key) {
            console.error('Credentials missing in .env.local');
            console.log('Found:', Object.keys(envVars));
            return;
        }

        console.log(`Testing connection to: ${url}`);

        const supabase = createClient(url, key);

        // Try a simple health check or auth check
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error connecting:', error);
        } else {
            console.log('✅ Connection Successful!');
            console.log('Supabase instance is reachable.');
        }

    } catch (err) {
        console.error('Test script error:', err);
    }
}

test();
