import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  // This resolves circular dependency
  @OneToMany("Post", "user")
  posts?: Post[];
}
