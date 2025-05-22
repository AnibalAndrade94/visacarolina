import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import * as dotenv from 'dotenv';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import * as nodemailer from 'nodemailer';

const app = express();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/mi-app-ng16/browser');
dotenv.config();
// 🔧 Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔒 Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env['EMAIL_USER'],
pass: process.env['EMAIL_PASS']
  },
});

// 📩 Ruta /send
app.post('/send', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  const mailOptions = {
    from: correo,
    to: process.env['EMAIL_USER'],
    subject: `Nuevo mensaje de ${nombre}`,
    html: `
      <h3>Has recibido un nuevo mensaje desde tu página:</h3>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).send({ error: "Error al enviar correo" });
  }
});

// 📨 Ruta /send-contacto
app.post('/send-contacto', async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  const mailOptions = {
    from: correo,
    to: process.env['EMAIL_USER'],
    subject: `Nuevo contacto: ${nombre}`,
    html: `
      <h3>Formulario de contacto:</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error al enviar contacto:", error);
    res.status(500).send({ error: "Error al enviar contacto" });
  }
});

// 🧠 Angular SSR
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// 📁 Rutas estáticas
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// 🧭 Todas las demás rutas → Angular
app.get('*', (req, res) => {
  res.render('index', {
    req,
    providers: [
      { provide: APP_BASE_HREF, useValue: req.baseUrl },
    ]
  });
});

export default app;
