import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field(() => String, { nullable: true })
  firstName!: string | null;

  @Field(() => String, { nullable: true })
  lastName!: string | null;
}
