import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
} as any;

describe('AuthService', () => {
  let service: AuthService;
  const jwt = {
    signAsync: jest.fn().mockResolvedValue('token'),
  } as unknown as JwtService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuthService(prismaMock, jwt);
  });

  it('registers a user when email is new', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, email: 'a@b.com', name: null, createdAt: new Date() });

    const res = await service.register({ email: 'a@b.com', password: '12345678' });
    expect(res.user.email).toBe('a@b.com');
    expect(res.token).toBe('token');
  });
});
