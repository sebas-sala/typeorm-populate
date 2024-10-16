import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { UserFactory } from "./factories/user.factory";
import { Post } from "./entities/post.entity";
import { PostFactory } from "./factories/post.factory";

describe("Factories", () => {
	let dataSource: DataSource;
	let userFactory: UserFactory;
	let postFactory: PostFactory;

	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			synchronize: true,
			entities: [User, Post],
		});
		await dataSource.initialize();

		userFactory = new UserFactory(dataSource);
		postFactory = new PostFactory(dataSource);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

	describe("UserFactory", () => {
		it("should create one user", async () => {
			const user = await userFactory.createOne({
				firstName: "John",
				lastName: "Doe",
				email: "test@test.com",
			});

			expect(user.id).toBeDefined();
			expect(user).toBeInstanceOf(User);
		});

		it("should create many users", async () => {
			const users = await userFactory.createMany(5);

			expect(users).toHaveLength(5);

			for (const user of users) {
				expect(user.id).toBeDefined();
				expect(user).toBeInstanceOf(User);
			}
		});
	});

	describe("PostFactory", () => {
		it("should create one post", async () => {
			const post = await postFactory.createOne();

			expect(post.id).toBeDefined();
			expect(post).toBeInstanceOf(Post);
		});

		it("should create many posts", async () => {
			const posts = await postFactory.createMany(5);

			expect(posts).toHaveLength(5);

			for (const post of posts) {
				expect(post.id).toBeDefined();
				expect(post).toBeInstanceOf(Post);
			}
		});
	});
});
