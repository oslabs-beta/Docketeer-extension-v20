/**
 * @jest-environment node
 */

import request from 'supertest';
import express from 'express';
import { describe, expect, test } from '@jest/globals';
import networkRouter from '../backend/routers/docker/networkRouter';

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use('/network', networkRouter);

// grabbing network containers
describe('/network/container', () => {
  test('Get networkContainers', async () => {
    const res = await request(app).get('/network/container');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((network) => {
      expect(network.networkName).toBeDefined();
      expect(network.containers).toBeDefined();
    });
  });
});

// grabbing networks
describe('/network/', () => {
  test('Get a list of networks running on Docker', async () => {
    const res = await request(app).get('/network/');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((network) => {
      expect(network.Name).toBeDefined();
    });
  });
});

// creating new network
describe('/networkCreate', () => {
  beforeAll(async () => {
    await request(app).post('/network/').send({
      networkName: 'test1',
    });
  });

  afterAll(async () => {
    await request(app).delete('/network/test1');
    await request(app).delete('/network/test2');
  });

  test('networkCreate with a valid name', async () => {
    const res = await request(app).post('/network/').send({
      networkName: 'test2',
    });
    expect(res.status).toBe(201);
    expect(res.body.hash).toBeDefined();
  });

  test('networkCreate duplicate', async () => {
    const res = await request(app).post('/network/').send({
      networkName: 'test1',
    });
    expect(res.status).toBe(500);
    expect(res.body.hash).not.toBeDefined();
    expect(res.error).toBeDefined();
  });

  test('networkCreate with an invalid name', async () => {
    const res = await request(app).post('/network/').send({
      networkName: '#test',
    });
    expect(res.status).toBe(500);
    expect(res.body.hash).not.toBeDefined();
    expect(res.error).toBeDefined();
  });
});

// deleting network
describe('/network/', () => {
  beforeAll(async () => {
    await request(app).post('/network/').send({
      networkName: 'test3',
    });
  });

  test('deleting a network', async () => {
    const res = await request(app).delete('/network/test3');
    expect(res.status).toBe(200);
    expect(res.body.hash).toBeDefined();
  });

  test('deleting a non-existant network returns error', async () => {
    const res = await request(app).delete('/network/test3');
    expect(res.status).toBe(500);
    expect(res.body.hash).not.toBeDefined();
    expect(res.error).toBeDefined();
  });
});

// connecting container to network
describe('/network/container', () => {
  beforeAll(async () => {
    await request(app).post('/network/').send({
      networkName: 'test4',
    });
  });

  afterAll(async () => {
    await request(app).delete(
      '/network/removeContainer/?networkName=test4&containerName=docketeer-ext'
    );
    await request(app).delete('/network/test4');
  });

  test('connecting container to the network', async () => {
    const res = await request(app).post('/network/container').send({
      networkName: 'test4',
      containerName: 'docketeer-ext',
    });
    expect(res.status).toBe(201);
  });

  test('connecting duplicate network to duplicate container', async () => {
    const res = await request(app).post('/network/container').send({
      networkName: 'test4',
      containerName: 'docketeer-ext',
    });
    expect(res.status).toBe(500);
    expect(res.error).toBeDefined();
  });
});

// disconnecting container from network
describe('/network/container', () => {
  beforeAll(async () => {
    await request(app).post('/network').send({
      networkName: 'test5',
    });

    await request(app).post('/network/container').send({
      networkName: 'test5',
      containerName: 'docketeer-ext',
    });
  });

  afterAll(async () => {
    await request(app).delete('/network/test5');
  });

  test('disconnect network from container', async () => {
    const res = await request(app).delete(
      '/network/removeContainer/?networkName=test5&containerName=docketeer-ext'
    );

    expect(res.status).toBe(204);
  });

  test('disconnecting non-existent network from container', async () => {
    const res = await request(app).post('/network/container').send({
      networkName: 'test5',
      containerName: 'docketeerdb',
    });
    expect(res.status).toBe(500);
  });
});
