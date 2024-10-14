import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import { DataSource } from "typeorm";
import { TypeormPopulate } from "../src";

describe("TypeormPopulate", () => {
	const dataSource = new DataSource({
		type: "sqlite",
		database: ":memory:",
		synchronize: true,
	});

	let typeormPopulate: TypeormPopulate;

	beforeAll(async () => {
		typeormPopulate = new TypeormPopulate({
			dataSource,
			factories: {},
		});
	});

	afterEach(async () => {
		await dataSource.destroy();
	});

	it("should initialize the data source", async () => {
		await typeormPopulate.initialize();
		expect(dataSource.isInitialized).toBe(true);
	});

	it("should destroy the data source", async () => {
		await typeormPopulate.initialize();
		await typeormPopulate.destroy();
		expect(dataSource.isInitialized).toBe(false);

		await typeormPopulate.initialize();
	});
});
