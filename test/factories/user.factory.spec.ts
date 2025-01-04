import { afterAll, beforeAll, describe, expect, it, spyOn } from "bun:test";

import { DataSource } from "typeorm";
import { UserFactory } from "../factories/user.factory";
import { User, Post } from "test/entities";
import { PostFactory } from "./post.factory";

describe("UserFactory", () => {
  let dataSource: DataSource;
  let userFactory: UserFactory;
  let postFactory: PostFactory;

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
    postFactory = new PostFactory(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("createOne", () => {
    it("should create one user", async () => {
      const uppercaseSpy = spyOn(
        userFactory as unknown as { uppercaseNames: () => void },
        "uppercaseNames"
      );

      const user = await userFactory.createOne({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "test@test.com",
        },
      });

      const post = await postFactory.createOne({
        data: {
          title: "Test Post",
          content: "This is a test post.",
          user: user,
        },
      });

      expect(user.id).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(uppercaseSpy).toHaveBeenCalled();

      expect(post.id).toBeDefined();
      expect(post.user).toMatchObject(user);
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
