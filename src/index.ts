// Source adapted from hono-api-template
// Original repo: https://github.com/Aditya-Jyoti/Hono-API-Template
// Modified by @Bisfren (Fajrie R Aradea)
import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { type JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const app = new OpenAPIHono<{ Variables: Variables }>();

// JWT setup
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET not set");
}

// Middlewares
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});
app.use("*", cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || [] }));

// Documentation and server start
app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "JWT Management API",
  },
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

import dbTestRoute from './routes/sample/db-test'
app.route('/api', dbTestRoute)

import userRoute from './routes/sample/user'
app.route('/api', userRoute)

import cacheRoute from './routes/sample/cache'
app.route('/api', cacheRoute)

import registerRoute from './routes/auth/register'
app.route('/api', registerRoute)

import loginRoute from './routes/auth/login'
app.route('/api', loginRoute)

import refreshtokenRoute from '../src/routes/auth/handlerefreshtoken'
app.route('/api', refreshtokenRoute)

import { handleLogout } from './routes/auth/logout'
app.post('/api/logout', handleLogout)


import { verifyAccessToken } from '../src/middleware/middlewareverifytoken'
import { handleLogoutAllSessions } from './routes/auth/logoutallsession'

app.post('/api/logout-all-session', verifyAccessToken, handleLogoutAllSessions)

import userCount from '../src/routes/user/count'
app.route('/api', userCount)

import usernameExist from '../src/routes/user/userexist'
app.route('/api', usernameExist)

import getAvatar from '../src/routes/user/useravatar'
app.route('/api', getAvatar)

import { myProfile, userProfile} from '../src/routes/user/myprofile'
app.route('/api', myProfile)
app.route('/api', userProfile)

import exportToCsv from '../src/routes/user/exporttocsv'
app.route('/api', exportToCsv)

import exportToXls from '../src/routes/user/exporttoxlsx'
app.route('/api', exportToXls)

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });

