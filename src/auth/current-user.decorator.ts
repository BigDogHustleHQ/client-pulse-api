import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const currentUserFactory = (
  _data: unknown,
  context: ExecutionContext,
): unknown => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext<{ req: { auth: unknown } }>().req.auth;
};

export const CurrentUser = createParamDecorator(currentUserFactory);
