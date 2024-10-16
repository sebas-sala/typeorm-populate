import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";

import { Post } from "../entities/post.entity";
import { PostFactory } from "./post.factory";

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

	describe("createOne", () => {
		it("should create one post", async () => {
			const post = await postFactory.createOne();

			expect(post.id).toBeDefined();
			expect(post).toBeInstanceOf(Post);
		});

		it("should create one post with data", async () => {
			const post = await postFactory.createOne({
				title: "Test Post",
				content: "This is a test post.",
			});

			expect(post.id).toBeDefined();
			expect(post.title).toBe("Test Post");
			expect(post.content).toBe("This is a test post.");
		});
	});

	describe("createMany", () => {
		it("should create many posts", async () => {
			const posts = await postFactory.createMany(5);

			expect(posts).toHaveLength(5);

			for (const post of posts) {
				expect(post.id).toBeDefined();
				expect(post).toBeInstanceOf(Post);
			}
		});

		it("should create many posts with data", async () => {
			const postsData = [
				{
					title: "Test Post 1",
					content: "This is a test post.",
				},
				{
					title: "Test Post 2",
					content: "This is another test post.",
				},
				{
					title: "Test Post 3",
					content: "This is yet another test post.",
				},
				{
					title: "Test Post 4",
					content: "This is a test post.",
				},
				{
					title: "Test Post 5",
					content: "This is another test post.",
				},
			];

			const posts = await postFactory.createMany(5, postsData);

			expect(posts).toHaveLength(5);

			for (let i = 0; i < 5; i++) {
				const post = posts[i];
				const postData = postsData[i];

				expect(post.id).toBeDefined();
				expect(post.title).toBe(postData.title);
				expect(post.content).toBe(postData.content);
			}
		});
	});
});
