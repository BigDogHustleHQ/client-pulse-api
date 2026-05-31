import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { currentUserFactory } from './current-user.decorator';

describe('currentUserFactory', () => {
  it('returns auth from the GQL request context', () => {
    const mockAuth = { sub: 'user_123' };
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { auth: mockAuth } }),
    } as unknown as GqlExecutionContext);

    const result = currentUserFactory(undefined, {} as ExecutionContext);

    expect(result).toEqual(mockAuth);
  });
});
