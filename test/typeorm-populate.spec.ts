import { DataSource } from "typeorm";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { factories } from "../examples/database/factories";
import { TypeormPopulate } from "../src/typeorm-populate";

import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";

describe("TypeormPopulate", () => {
	let dataSource: DataSource;

	let typeormPopulate: TypeormPopulate;

	beforeEach(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			synchronize: true,
			entities: [User, Post],
		});

		typeormPopulate = new TypeormPopulate({
			dataSource,
			factories,
		});
	});

	it("should be defined", () => {
		expect(typeormPopulate).toBeDefined();
	});

	afterEach(async () => {
		if (typeormPopulate.isInitialized()) {
			await typeormPopulate.destroy();
		}
	});

	describe("initialize", () => {
		it("should initialize the data source", async () => {
			await typeormPopulate.initialize();

			expect(typeormPopulate.isInitialized()).toBe(true);
		});

		it("should throw an error if the data source is already initialized", async () => {
			await typeormPopulate.initialize();

			await expect(typeormPopulate.initialize()).rejects.toThrow(
				'Cannot create a "default" connection because connection to the database already established.',
			);
		});
	});

	describe("isInitialized", () => {
		it("should return false if the data source is not initialized", () => {
			expect(typeormPopulate.isInitialized()).toBe(false);
		});

		it("should return true if the data source is initialized", async () => {
			await typeormPopulate.initialize();

			expect(typeormPopulate.isInitialized()).toBe(true);
		});
	});

	describe("destroy", () => {
		it("should destroy the data source", async () => {
			await typeormPopulate.initialize();
			await typeormPopulate.destroy();

			expect(typeormPopulate.isInitialized()).toBe(false);
		});

		it("should throw an error if the data source is not initialized", async () => {
			await expect(typeormPopulate.destroy()).rejects.toThrow(
				'Cannot execute operation on "default" connection because connection is not yet established.',
			);
		});
	});

	describe("seed", () => {
		it("should seed the database with a specific number of records", async () => {
			await typeormPopulate.initialize();
			const res = await typeormPopulate.seed("user", 5);

			expect(res).toHaveLength(5);
		});

		it("should throw an error if the factory does not exist", async () => {
			await typeormPopulate.initialize();

			await expect(typeormPopulate.seed("nonExistent", 5)).rejects.toThrow(
				"Factory nonExistent not found",
			);
		});
	});

	describe("seedMany", () => {
		it("should seed the database with multiple factories", async () => {
			await typeormPopulate.initialize();
			await typeormPopulate.seedMany([
				{ entity: "user", amount: 5 },
				{ entity: "post", amount: 10 },
			]);

			const users = await dataSource.getRepository(User).find();
			const posts = await dataSource.getRepository(Post).find();

			expect(users).toHaveLength(5);
			expect(posts).toHaveLength(10);
		});

		it("should throw an error if the factory does not exist", async () => {
			await typeormPopulate.initialize();

			await expect(
				typeormPopulate.seedMany([
					{ entity: "user", amount: 5 },
					{ entity: "nonExistent", amount: 10 },
				]),
			).rejects.toThrow("Factory nonExistent not found");
		});
	});

	describe("seedAll", () => {
		it("should seed the database with all factories", async () => {
			await typeormPopulate.initialize();
			await typeormPopulate.seedAll(5);

			const users = await dataSource.getRepository(User).find();
			const posts = await dataSource.getRepository(Post).find();

			expect(users).toHaveLength(5);
			expect(posts).toHaveLength(5);
		});
	});
});
