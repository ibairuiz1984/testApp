const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

// Asegúrate de que la ruta de tu archivo de credenciales sea correcta
const serviceAccount = require('./testdb-a4950-firebase-adminsdk-fbsvc-19e43a1983.json');

// Inicializa Firebase Admin SDK con tus credenciales
admin.initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Asegúrate de que la ruta a tu archivo info.json sea correcta
const data = require('./data/info.json'); // Si está en la carpeta data

async function importData() {
  for (const [key, value] of Object.entries(data)) {
    await db.collection('tests').doc(key).set(value);
  }
  console.log('Datos importados correctamente.');
}

importData();
