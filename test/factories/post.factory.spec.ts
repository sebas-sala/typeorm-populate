import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";

import { Post } from "@/test/entities/post.entity";
import { PostFactory } from "@/test/factories/post.factory";

describe("PostFactory", () => {
	let dataSource: DataSource;
	let postFactory: PostFactory;

	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			synchronize: true,
			entities: [Post],
		});
		await dataSource.initialize();

		postFactory = new PostFactory(dataSource);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

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
