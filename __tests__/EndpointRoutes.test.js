import request from 'supertest';
import mongoose from 'mongoose';
import redis from 'redis';
import app from '../backend/server';
import router from '../backend/routers/docker/imageRouter';
import imageController from '../backend/controllers/docker/imagesController'; 
import cacheController from '../backend/controllers/docker/cacheController';
import { TextEncoder, TextDecoder } from 'util';
import { describe, beforeEach, expect, test, jest } from '@jest/globals';

// Jest command for async: jest --detectOpenHandles <test file>

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mocking imageController
jest.mock("../backend/controllers/docker/imagesController", () => ({
  getImages: jest.fn(),
}));

beforeAll(async () => {
    red = redis.createClient();
    await red.connect();
});

afterAll((done) => {
    red.quit(() => {
        done();
    });
});

describe('Testing cacheController and Redis', () => {
  jest.mock('../backend/cache/redis', () => ({
    set: jest.fn(),
    get: jest.fn(), 
    expire: jest.fn()
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set cache properly', async () => {
    const req = {}; 
    const res = { locals: { cachedDbStatus: false } };
    const next = jest.fn(); 

    await cacheController.setCacheGrypeDb(req, res, next);
    expect(res.locals.cachedDbStatus).toBe(true);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

xdescribe('Image Router Endpoints', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: jest.fn(),
			},
			writable: true,
		});
	});

		// Mongoose handling
	beforeAll(async () => {
			await mongoose.connect('mongodb://localhost:27017/docketeer', {
					useNewUrlParser: true,
					useUnifiedTopology: true,
			});
	});

	afterAll(async () => {
			await mongoose.connection.close();
	});

	describe('GET /', () => {
		it('should return 200 and images with matching IDs', async () => {
			imageController.getImages.mockImplementation((req, res, next) => {
				res.locals.images = mockDockerImages;
				next();
			});

			await request(app)
				.get('/api/docker/image/')
				.expect(200)
				.expect('Content-Type', /json/)
				.then((response) => {
					response.body.forEach((image) => {
						expect(image.Repository).toEqual('extension-docketeer');
					});
				});
		});
	});

	xdescribe('POST /scan', () => {
		it('should return 200 and scan results', async () => {
			const scanResults = {
				/*  mock data */
			};
			imageController.scanImages.mockImplementation((req, res, next) => {
				res.locals.vulnerabilities = scanResults.vulnerabilities;
				res.locals.everything = scanResults.everything;
				res.locals.timeStamp = scanResults.timeStamp;
				res.locals.saved = scanResults.saved;
				next();
			});

			cacheController.setCacheScan.mockImplementation((req, res, next) => {
				// Mock implementation if needed
				next();
			});

			await request(app)
				.post('/scan')
				.send({
					/* mock request body */
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.then((response) => {
					expect(response.body).toEqual(scanResults);
				});
		});
	});
});


// More Endpoint Tests----------------------

xdescribe('POST /api/docker/image/scan', () => {
	it('respond a status of 200 and json', async function () {
		const response = await request(app)
			.post('/api/docker/image/scan')
			.set('Accept', 'application/json')
			.send({ scanName: 'mysql:latest' });
		console.log(response.headers);
		expect(response.headers['content-type']).toMatch(/json/);
		expect(response.status).toEqual(200);
	});
});

xdescribe('POST /api/docker/image/run', () => {
	it('respond a status of 201 and json header', async function () {
		const response = await request(app).post('/api/docker/image/run');
		expect(response.status).toEqual(201);
	});
});

jest.mock('backend/controllers/docker/imagesController', () => ({
	removeImage: jest.fn((req, res, next) => next()),
}));

describe('DELETE /api/docker/image/:id', () => {
	it('respond a status of 204 and json header', async function () {
		const response = await request(app).post('/api/docker/image/:id');
		expect(response.status).toEqual(204);
	});
});

// Mock the implementation of imageController.scanImages
jest
	.spyOn(imageController, 'scanImages')
	.mockImplementation(async (req, res, next) => {
		// Mocked data for testing
		const mockedVulnerabilities = {
			Medium: 2,
			Low: 5,
			High: 1,
			Critical: 0,
		};

		// Set the mocked data in res.locals
		res.locals.vulnerabilities = mockedVulnerabilities;

		// Call the next middleware (assuming scanImages uses next())
		next();
	});

// Now you can use the mocked imageRouter in your test
xdescribe('POST /api/docker/image/scan', () => {
	test('responds with vulnerability count and status of 200', async () => {
		// Prepare the sample request body
		const sampleRequestBody = { scanName: 'mysql:latest' };

		// Send a POST request to your endpoint
		const response = await request(app)
			.post('/api/docker/image/scan')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.send(sampleRequestBody);

		// Log additional information
		console.log('header: ', response.headers);
		console.log('status and body: ', response.status, response.body);

		// Now you can make assertions based on the mocked behavior of imageController.scanImages
		// expect(response.status).toBe(200);
		expect(response.body).toEqual({
			Medium: expect.any(Number),
			Low: expect.any(Number),
			High: expect.any(Number),
			Critical: expect.any(Number),
		});

		// Ensure that the mocked function was called
		expect(imageController.scanImages).toHaveBeenCalled();
	});
});

xdescribe('/command/networkListContainers', () => {
  test('Get networkListContainers', async () => {
    const res = await request(app).get('/command/networkListContainers');
    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    res.body.forEach(network => {
      expect(network.networkName).toBeDefined()
      expect(network.containers).toBeDefined()
    })
  })
})

xdescribe('/network/container', () => {
	test('Get a list of networks with the containers they are attached to', async () => {
		const res = await request(app).get('/network/container');
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		res.body.forEach((network) => {
			expect(network.networkName).toBeDefined();
			expect(network.containers).toBeDefined();
		});
	});
});

xdescribe('/command/networkCreate', () => {

  beforeAll(async () => {
    await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test2",
      })
  })

  afterAll(async () => {
  await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test1",
      })
  await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test2",
      })
});

  test('networkCreate with a valid name', async () => {
    const res = await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test1",
      })
    expect(res.status).toBe(200)
    expect(res.body.hash).toBeDefined()
  });

  test('networkCreate duplicate', async () => {
    const res = await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test2",
      })
    expect(res.status).toBe(200)
    expect(res.body.hash).not.toBeDefined()
    expect(res.body.error).toBeDefined()
  });

  test('networkCreate with an invalid name', async () => {
    const res = await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "#test",
      })
    expect(res.status).toBe(200)
    expect(res.body.hash).not.toBeDefined()
    expect(res.body.error).toBeDefined()
  });
})

xdescribe('/network/', () => {
	beforeAll(async () => {
		await request(app).post('/network/').send({
			networkName: 'test2',
		});
	});

	afterAll(async () => {
		await request(app).delete('/network/test1');
		await request(app).delete('/network/test2');
	});

	test('create network with a valid name', async () => {
		const res = await request(app).post('/network/').send({
			networkName: 'test1',
		});
		expect(res.status).toBe(201);
		expect(res.body.hash).toBeDefined();
	});

	test('create an invalid duplicate network', async () => {
		const res = await request(app).post('/network/').send({
			networkName: 'test2',
		});
		expect(res.status).toBe(500);
		expect(res.body.hash).not.toBeDefined();
		//TODO: Error property is not what we are expecting: 'error message in server: { err: 'networkController.createNetwork error' }'
		expect(res.error).toBeDefined();
	});

	test('create a network with an invalid name', async () => {
		const res = await request(app).post('/network/').send({
			networkName: '#test',
		});
		expect(res.status).toBe(500);
		expect(res.body.hash).not.toBeDefined();
		expect(res.error).toBeDefined();
	});
});

xdescribe('/command/networkRemove', () => {

  beforeAll(async () => {
    await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test3",
      })
  });

  test('networkRemove', async () => {
    const res = await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test3",
      })
    expect(res.status).toBe(200)
    expect(res.body.hash).toBeDefined()
  });

  test('networkRemove duplicate', async () => {
    const res = await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test3",
      })
    expect(res.status).toBe(200)
    expect(res.body.hash).not.toBeDefined()
    expect(res.body.error).toBeDefined()
  });
})

dxescribe('/network/', () => {
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

xdescribe('/command/networkConnect', () => {

  beforeAll(async () => {
    await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test4",
      })

    await request(app)
      .post('/command/runImage')
      .send({
        reps: "nginx",
        tag: "latest"
      })
  });

  afterAll(async () => {
    await request(app)
      .post('/command/networkDisconnect')
      .send({
        networkName: "test4",
        containerName: "docketeerdb"
      })

    await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test4",
      })

  });

  test('networkConnect', async () => {
    const res = await request(app)
      .post('/command/networkConnect')
      .send({
        networkName: "test4",
        containerName: "docketeerdb"

      })
    expect(res.status).toBe(200)
    expect(res.body.hash).toBeDefined()
    expect(res.body.error).not.toBeDefined()
  });

  test('networkConnect duplicate', async () => {
    const res = await request(app)
      .post('/command/networkConnect')
      .send({
        networkName: "test4",
        containerName: "docketeerdb"

      })
    expect(res.status).toBe(200)
    expect(res.body.hash).not.toBeDefined()
    expect(res.body.error).toBeDefined()
  });
})

xdescribe('/network/container', () => {
	beforeAll(async () => {
		await request(app).post('/network/').send({
			networkName: 'test4',
		});

		await request(app)
		  .post('/command/runImage')
		  .send({
		    reps: "nginx",
		    tag: "latest"
		  })
	});

	afterAll(async () => {
		await request(app)
			.delete('/network/removeContainer/?name=gabyTest')
			.delete(
				'/network/removeContainer/?networkName=test4&containerName=docketeer-ext'
			);
		.delete('/network/removeContainer/?networkName=test4')
		.send({
		  networkName: "test4",
		  containerName: "docketeerdb"
		})

		await request(app).delete('/network/test4');
	});

	test('connecting container to the network', async () => {
		const res = await request(app).post('/network/container').send({
			networkName: 'test4',
			containerName: 'docketeer-ext',
		});
		expect(res.status).toBe(201);
		// expect(res.body.hash).toBeDefined()
		// expect(res.body.error).not.toBeDefined()
	});

	test('connecting duplicate network to duplicate container', async () => {
		const res = await request(app).post('/network/container').send({
			networkName: 'test4',
			containerName: 'docketeer-ext',
		});
		expect(res.status).toBe(500);
		// expect(res.body.hash).not.toBeDefined()
		expect(res.error).toBeDefined();
	});
});

xdescribe('/command/networkDisconnect', () => {

  beforeAll(async () => {
    await request(app)
      .post('/command/networkCreate')
      .send({
        networkName: "test5",
      })

    await request(app)
      .post('/command/networkConnect')
      .send({
        networkName: "test5",
        containerName: "docketeerdb"
      })
  });

  afterAll(async () => {
    await request(app)
      .post('/command/networkRemove')
      .send({
        networkName: "test5",
      })
  });

  test('networkDisconnect', async () => {

    const res = await request(app)
      .post('/command/networkDisconnect')
      .send({
        networkName: "test5",
        containerName: "docketeerdb"

      })
    expect(res.status).toBe(200)
    expect(res.body.hash).toBeDefined()
    expect(res.body.error).not.toBeDefined()
  });

  test('networkDisconnect duplicate', async () => {
    const res = await request(app)
      .post('/command/networkDisconnect')
      .send({
        networkName: "test5",
        containerName: "docketeerdb"

      })
    expect(res.status).toBe(200)
    expect(res.body.hash).not.toBeDefined()
    expect(res.body.error).toBeDefined()
  });
})

xdescribe('/network/container', () => {
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
		// .send({
		//   networkName: "test5",
		// })
	});

	test('disconnect network from container', async () => {
		const res = await request(app).delete(
			'/network/removeContainer/?networkName=test5&containerName=docketeer-ext'
		);
		// .send({
		//   networkName: "test5",
		//   containerName: "docketeer-ext"

		// })
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

