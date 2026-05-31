import { Test, TestingModule } from '@nestjs/testing';
import { CLERK_CLIENT } from '../auth/clerk.module';
import { UserService } from './user.service';

const mockGetUser = jest.fn();
const mockClerkClient = {
  users: { getUser: mockGetUser },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: CLERK_CLIENT, useValue: mockClerkClient },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a mapped user from Clerk', async () => {
    mockGetUser.mockResolvedValueOnce({
      id: 'user_123',
      emailAddresses: [{ emailAddress: 'jane@company.com' }],
      firstName: 'Jane',
      lastName: 'Smith',
    });

    const result = await service.getCurrentUser('user_123');

    expect(result).toEqual({
      id: 'user_123',
      email: 'jane@company.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });
    expect(mockGetUser).toHaveBeenCalledWith('user_123');
  });

  it('falls back to empty string when user has no email addresses', async () => {
    mockGetUser.mockResolvedValueOnce({
      id: 'user_456',
      emailAddresses: [],
      firstName: 'No',
      lastName: 'Email',
    });

    const result = await service.getCurrentUser('user_456');

    expect(result.email).toEqual('');
  });
});
