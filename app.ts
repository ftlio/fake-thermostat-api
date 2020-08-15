import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser';
import { Thermostat } from './thermostat';

const thermostats = new Map<string, Thermostat>();

const app = new Koa();
const router = new Router();

const InfiniteFakeThermostats = async (ctx: any, next: any) => {
  const id = ctx.params.thermostat_id;
  if (!thermostats.has(id)) {
    try {
      const thermostat = new Thermostat(id);
      thermostats.set(id, thermostat);
    } catch (err) {
      // Only error should be from the ID not being a UUID
      // Treat this as a "not found" error
      ctx.status = 404
      ctx.body = {
        error: err.message
      }
      return
    }
  }

  const thermostat = thermostats.get(id);
  thermostat.step();
  thermostats.set(id, thermostat);
  next();
};

// Retrieve Thermostat Handler
router.get('/:thermostat_id', InfiniteFakeThermostats, (ctx, next) => {
  const thermostat = thermostats.get(ctx.params.thermostat_id);
  ctx.body = thermostat.serialize();
  next();
});

// Update Thermostat Handler
router.patch('/:thermostat_id', InfiniteFakeThermostats, (ctx, next) => {
  const thermostat = thermostats.get(ctx.params.thermostat_id);
  try {
    thermostat.update(ctx.request.body);
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      error: err.message
    }
    return;
  }
  ctx.body = thermostat.serialize();
  next();
});

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const port = process.argv[2] || 5000;

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
