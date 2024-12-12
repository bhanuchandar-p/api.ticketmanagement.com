import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors';
import ticketsRouter from './routers/ticketRoutes';


const app = new Hono()
const port = Number(process.env.PORT || 3000);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.use(
  '/*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 600,
    credentials: true,
  })
);

app.route('/tickets', ticketsRouter);


console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
app.onError((err: any, c: Context) => {
  if (err.isOperational) {
    // TODO: Log the error
  }
  console.error(err);
  c.status(err.status || 555);
  return c.json({
    status: err.status || 555,
    success: false,
    message: err.message || "Internal server error",
    errData: err.errData || undefined,
  });
});