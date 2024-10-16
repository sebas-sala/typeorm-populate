import { DataSource } from "typeorm";

import { factories } from "./factories";
import { TypeormPopulate } from "../../src/typeorm-populate";

import { Post } from "../../test/entities/post.entity";
import { User } from "../../test/entities/user.entity";

import { UserFactory } from "../../test/factories/user.factory";

(async () => {
	/**
	 * Initializes a new DataSource instance for an SQLite in-memory database.
	 *
	 * @constant
	 * @type {DataSource}
	 * @property {string} type - The type of database, in this case, "sqlite".
	 * @property {string} database - The database connection string, ":memory:" for an in-memory database.
	 * @property {boolean} synchronize - Indicates if the database schema should be auto-created on every application launch.
	 * @property {Array} entities - An array of entity classes to be loaded for this connection.
	 */
	const dataSource = new DataSource({
		type: "sqlite",
		database: ":memory:",
		synchronize: true,
		entities: [User, Post],
	});

	/**
	 * Initializes a new instance of the TypeormPopulate class.
	 *
	 * @param dataSource - The data source configuration for TypeORM.
	 * @param factories - An array of factory functions used to generate entities.
	 */
	const populator = new TypeormPopulate({
		dataSource,
		factories,
	});

	try {
		/**
		 * Initializes the data source connection.
		 */
		await populator.initialize();

		/**
		 * Seeds the database with a specified amount of entities for a given entity name.
		 *
		 * @param factoryName - The name of the factory to be used for seeding.
		 * @param amount - The amount of entities to be created.
		 *
		 *
		 * @returns A list of seeded entities.
		 * @throws An error if the factory is not found.
		 */
		await populator.seed("user", 5);
		await populator.seed("post", 10);

		/**
		 * Seeds the database with multiple entities for each factory.
		 *
		 * @param factoryData - An array of objects containing the entity name and the amount of entities to be created.
		 */
		await populator.seedMany([
			{ entity: "user", amount: 5 },
			{ entity: "post", amount: 10 },
		]);

		/**
		 * Seeds the database with a specified amount of entities for all factories.
		 *
		 * @param count - The amount of entities to be created for each factory.
		 */
		await populator.seedAll(5);

		/**
		 * Creates an instance of UserFactory using the provided data source.
		 *
		 * @param dataSource - The data source to be used by the UserFactory for database operations.
		 */
		const userFactory = new UserFactory(dataSource);
		await userFactory.createOne({
			firstName: "John",
			lastName: "Doe",
			email: "oiaerstoia.com",
		});
		await userFactory.createMany(5);
	} catch (error) {
		console.error(error);
	} finally {
		await populator.destroy();
	}
})();
