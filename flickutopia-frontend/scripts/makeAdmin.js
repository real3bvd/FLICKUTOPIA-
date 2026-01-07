import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Usage: node scripts/makeAdmin.js <user-email>
// Requires: serviceAccountKey.json in the scripts folder

const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <user-email>');
    process.exit(1);
}

async function makeAdmin(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`✓ Successfully set admin claim for ${email}`);
        console.log('  User must log out and log back in for changes to take effect.');
    } catch (error) {
        console.error('Error setting admin claim:', error.message);
        process.exit(1);
    }
}

makeAdmin(email);
