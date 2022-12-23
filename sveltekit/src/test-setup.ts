import 'reflect-metadata';
import { mockServer } from '$lib/testing/mock-server';
import fetch from 'cross-fetch';

global.fetch = fetch;

beforeAll(() => {
	mockServer.listen({
		onUnhandledRequest: 'warn'
	});
});

afterEach(() => {
	mockServer.resetHandlers();
});

afterAll(() => {
	mockServer.close();
});
