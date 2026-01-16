import { ApiError, apiFetch } from '@/src/lib/api';

describe('apiFetch', () => {
  it('throws ApiError on non-2xx', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
      text: async () => 'Unauthorized',
    });

    await expect(apiFetch('/auth/me')).rejects.toBeInstanceOf(ApiError);
    await expect(apiFetch('/auth/me')).rejects.toMatchObject({ status: 401 });
  });
});
