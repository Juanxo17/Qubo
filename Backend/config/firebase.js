import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, '../firebase/firebase-service-account.json');

let adminAuth = null;

try {
  const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf-8'));

  const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

  adminAuth = getAuth(firebaseApp);
  console.log('Firebase Admin inicializado correctamente.');
} catch (error) {
  console.warn('Firebase Admin no configurado (falta el service account). El login con Firebase se desactiva.');
  console.warn('Detalle:', error.message);
}

export default adminAuth;
