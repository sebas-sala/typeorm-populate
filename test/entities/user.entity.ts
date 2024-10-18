import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

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

	// @OneToMany(
	// 	() => Post,
	// 	(post) => post.user,
	// )
	// posts!: Post[];
}
