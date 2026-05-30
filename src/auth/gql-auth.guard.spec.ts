import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verifyToken } from '@clerk/backend';
import { GqlAuthGuard } from './gql-auth.guard';

jest.mock('@clerk/backend', () => ({
  verifyToken: jest.fn(),
}));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let mockReq: { headers: Record<string, string>; auth?: unknown };

  beforeEach(() => {
    guard = new GqlAuthGuard();
    mockReq = { headers: {} };
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: mockReq }),
    } as unknown as GqlExecutionContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws UnauthorizedException when Authorization header is missing', async () => {
    await expect(guard.canActivate({} as ExecutionContext)).rejects.toThrow(
      new UnauthorizedException('Missing authorization header'),
    );
  });

  it('throws UnauthorizedException when Authorization header is not a Bearer token', async () => {
    mockReq.headers['authorization'] = 'Basic abc123';

    await expect(guard.canActivate({} as ExecutionContext)).rejects.toThrow(
      new UnauthorizedException('Missing authorization header'),
    );
  });

  it('returns true and attaches auth payload to req on valid token', async () => {
    mockReq.headers['authorization'] = 'Bearer valid.jwt.token';
    const payload = { sub: 'user_123', sid: 'sess_abc' };
    mockVerifyToken.mockResolvedValueOnce(payload as never);

    const result = await guard.canActivate({} as ExecutionContext);

    expect(result).toBe(true);
    expect(mockReq.auth).toEqual(payload);
    expect(mockVerifyToken).toHaveBeenCalledWith('valid.jwt.token', {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  });

  it('throws UnauthorizedException when token verification fails', async () => {
    mockReq.headers['authorization'] = 'Bearer expired.jwt.token';
    mockVerifyToken.mockRejectedValueOnce(new Error('Token expired'));

    await expect(guard.canActivate({} as ExecutionContext)).rejects.toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });
});
