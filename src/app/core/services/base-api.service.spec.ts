import { Injector } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { MessageService } from 'primeng/api';

import { BaseApiService } from './base-api.service';
import { SupabaseService } from './supabase.service';

class TestApiService extends BaseApiService {
  public override fetchRpc<T>(
    rpcName: string,
    params: Record<string, unknown> | object,
    options: {
      errorContext: string;
      errorTitle?: string;
      showErrorToast?: boolean;
      fetchAll?: boolean;
      pageSize?: number;
    },
  ): Promise<T | null> {
    return super.fetchRpc(rpcName, params, options);
  }
}

describe('BaseApiService.fetchRpc', () => {
  function setup() {
    const rpc = vi.fn();
    const client = { rpc } as unknown as SupabaseClient;
    const supabaseService = { getClient: () => client } as unknown as SupabaseService;
    const messageService = new MessageService();
    const addSpy = vi.spyOn(messageService, 'add');

    const injector = Injector.create({
      providers: [
        { provide: SupabaseService, useValue: supabaseService },
        { provide: MessageService, useValue: messageService },
        TestApiService,
      ],
    });

    return {
      service: injector.get(TestApiService),
      rpc,
      addSpy,
    };
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the typed data and shows no toast on success', async () => {
    const { service, rpc, addSpy } = setup();
    rpc.mockResolvedValue({ data: { id: 7 }, error: null });

    const result = await service.fetchRpc<{ id: number }>(
      'get_thing',
      { a: 1 },
      { errorContext: 'test data' },
    );

    expect(result).toEqual({ id: 7 });
    expect(rpc).toHaveBeenCalledWith('get_thing', { a: 1 });
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('returns null and toasts a failed-load message on an RPC error', async () => {
    const { service, rpc, addSpy } = setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const result = await service.fetchRpc('get_thing', {}, { errorContext: 'players' });

    expect(result).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error loading players:', { message: 'boom' });
    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load players',
      life: 8000,
    });
  });

  it('uses the provided error title on an RPC error', async () => {
    const { service, rpc, addSpy } = setup();
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', errorTitle: 'Custom Title' },
    );

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Custom Title',
      detail: 'Failed to load players',
      life: 8000,
    });
  });

  it('returns null without toasting when showErrorToast is false on an RPC error', async () => {
    const { service, rpc, addSpy } = setup();
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', showErrorToast: false },
    );

    expect(result).toBeNull();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('returns null and toasts an unexpected-error message when rpc throws', async () => {
    const { service, rpc, addSpy } = setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const thrown = new Error('network down');
    rpc.mockRejectedValue(thrown);

    const result = await service.fetchRpc('get_thing', {}, { errorContext: 'players' });

    expect(result).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Unexpected error:', thrown);
    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred while loading players',
      life: 8000,
    });
  });

  it('returns null without toasting when showErrorToast is false and rpc throws', async () => {
    const { service, rpc, addSpy } = setup();
    rpc.mockRejectedValue(new Error('network down'));

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', showErrorToast: false },
    );

    expect(result).toBeNull();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('merges pages in offset order when fetchAll is true', async () => {
    const { service, rpc, addSpy } = setup();
    const pages = [[{ id: 1 }, { id: 2 }], [{ id: 3 }]];
    const rangeCalls: Array<[number, number]> = [];
    rpc.mockReturnValue({
      range: (from: number, to: number) => {
        rangeCalls.push([from, to]);
        return Promise.resolve({ data: pages.shift(), error: null });
      },
    });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'things', fetchAll: true, pageSize: 2 },
    );

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(rangeCalls).toEqual([
      [0, 1],
      [2, 3],
    ]);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('returns a single page unchanged when the result fits in one page', async () => {
    const { service, rpc, addSpy } = setup();
    rpc.mockReturnValue({
      range: () => Promise.resolve({ data: [{ id: 1 }, { id: 2 }], error: null }),
    });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'things', fetchAll: true, pageSize: 1000 },
    );

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('stops on the first short page when the result is an exact multiple of the page size', async () => {
    const { service, rpc } = setup();
    const pages = [[{ id: 1 }, { id: 2 }], [{ id: 3 }, { id: 4 }], []];
    rpc.mockReturnValue({
      range: () => Promise.resolve({ data: pages.shift(), error: null }),
    });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'things', fetchAll: true, pageSize: 2 },
    );

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    expect(rpc).toHaveBeenCalledTimes(3);
  });

  it('returns null with no partial data when a page fails mid-pagination', async () => {
    const { service, rpc, addSpy } = setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const pages: Array<{ data: unknown; error: unknown }> = [
      { data: [{ id: 1 }, { id: 2 }], error: null },
      { data: null, error: { message: 'boom' } },
    ];
    rpc.mockReturnValue({
      range: () => Promise.resolve(pages.shift()),
    });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'things', fetchAll: true, pageSize: 2 },
    );

    expect(result).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error loading things:', { message: 'boom' });
    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load things',
      life: 8000,
    });
  });
});
