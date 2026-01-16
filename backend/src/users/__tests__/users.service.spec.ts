import { UsersService } from '../users.service';

const prismaMock = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as any;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UsersService(prismaMock);
  });

  it('lists users', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 1, email: 'a@b.com' }]);
    const res = await service.list();
    expect(res).toHaveLength(1);
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('throws when user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.get(999)).rejects.toThrow('User not found');
  });
});
