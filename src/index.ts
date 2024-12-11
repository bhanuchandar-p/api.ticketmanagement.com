import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import dotenv from 'dotenv';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import onboardRouter from './routers/onboardRouter';
dotenv.config();

const app = new Hono().basePath(`/api/v${process.env.API_VERSION}`);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth',authRouter);
app.route('/users',userRouter);
app.route('/onboard',onboardRouter);


app.onError((err: any, c: Context) => {
  c.status(err.status || 500);
  return c.json({
    success: false,
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    errData: err.errData || undefined
  })
});

const port = Number(process.env.PORT) || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
