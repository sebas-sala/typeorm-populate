import { afterAll, beforeAll, describe, expect, it, spyOn } from "bun:test";

import { DataSource } from "typeorm";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { UserFactory } from "../factories/user.factory";

describe("UserFactory", () => {
	let dataSource: DataSource;
	let userFactory: UserFactory;

	beforeAll(async () => {
		await Promise.resolve();

		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			synchronize: true,
			entities: [User, Post],
		});
		await dataSource.initialize();

		userFactory = new UserFactory(dataSource);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

	describe("createOne", () => {
		it("should create one user", async () => {
			const uppercaseSpy = spyOn(
				userFactory as unknown as { uppercaseNames: () => void },
				"uppercaseNames",
			);

			const user = await userFactory.createOne({
				firstName: "John",
				lastName: "Doe",
				email: "test@test.com",
			});

			expect(user.id).toBeDefined();
			expect(user).toBeInstanceOf(User);
			expect(uppercaseSpy).toHaveBeenCalled();
		});
	});

	describe("createMany", () => {
		it("should create many users", async () => {
			const users = await userFactory.createMany(5);

			expect(users).toHaveLength(5);

			for (const user of users) {
				expect(user.id).toBeDefined();
				expect(user).toBeInstanceOf(User);
			}
		});
	});
});
