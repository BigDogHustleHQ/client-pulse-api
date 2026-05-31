import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const mockUserService = {
  getCurrentUser: jest.fn(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls userService.getMe with the auth subject and returns the user', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'jane@company.com',
      firstName: 'Jane',
      lastName: 'Smith',
    };
    mockUserService.getCurrentUser.mockResolvedValueOnce(mockUser);

    const result = await resolver.getCurrentUser({ sub: 'user_123' });

    expect(mockUserService.getCurrentUser).toHaveBeenCalledWith('user_123');
    expect(result).toEqual(mockUser);
  });
});
