// biome-ignore assist/source/organizeImports: <linter capricieux>
import type { Request, Response } from "express";
import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";
import routes from "./routes";
// import session from "express-session";
import cors from "cors";
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler';
// import csrf from "csurf";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";


// Charge les variables d'environnement
dotenv.config();

// Configuration du serveur Express
const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(cookieParser());

// --- Middleware CORS ---
// const allowedOrigins = ["http://localhost"];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session ---
// app.use(session({
//   secret: process.env.SESSION_SECRET || "secret",
//   resave: true,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // true en prod
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   }
// }));

// // --- CSRF ---
// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//   },
// });

// // Routes exclues de la protection CSRF
// const csrfExclude = [
//   "/auth/login" ,
//   "/csrf-token" 
// ];

// // CSRF appliqué seulement sur les routes protégées
// app.use("/api", (req, res, next) => {
//   if (csrfExclude.includes(req.path)) {
//     return next();
//   }
//   csrfProtection(req, res, next);   
  
// });

// // CSRF Token route protégée pour initialiser le token
// app.get("/api/csrf-token",  (req: Request, res: Response) => {

//   csrfProtection(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Erreur CSRF" });
//     }
//     res.json({ csrfToken: req.csrfToken() });
// });
// });

// --- Swagger ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- Routes API ---
app.use("/api", routes);

// --- Error handler ---
app.use(errorHandler);

app.use(express.static("public"));

// --- Création du serveur HTTP à partir de l'app Express ---
const server = createServer(app);

// --- Initialisation du serveur Socket.IO sur ce serveur HTTP ---
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // TODO: adapter selon besoin, idéalement limiter les origines
    credentials: true,
    methods: ["GET", "POST"],
  }
});

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
  console.log(`Un utilisateur s'est connecté avec l'ID ${socket.id}`);

  socket.on("send_message", (message) => {
    console.log(`Message reçu de ${socket.id} :`, message);
    io.emit("receive_message", message);
    // ou socket.broadcast.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur ${socket.id} déconnecté`);
  });
});

// --- Root ---
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the API. Visit /api-docs for documentation");
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
});