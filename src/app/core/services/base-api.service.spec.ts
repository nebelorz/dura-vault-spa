import { Injector } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { BaseApiService } from './base-api.service';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

class TestApiService extends BaseApiService {
  public override fetchRpc<T>(
    rpcName: string,
    params: Record<string, unknown> | object,
    options: {
      errorContext: string;
      errorTitle?: string;
      showErrorToast?: boolean;
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
    const toastService = new ToastService();
    const errorSpy = vi.spyOn(toastService, 'error');
    const successSpy = vi.spyOn(toastService, 'success');

    const injector = Injector.create({
      providers: [
        { provide: SupabaseService, useValue: supabaseService },
        { provide: ToastService, useValue: toastService },
        TestApiService,
      ],
    });

    return {
      service: injector.get(TestApiService),
      rpc,
      errorSpy,
      successSpy,
    };
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the typed data and shows no toast on success', async () => {
    const { service, rpc, errorSpy, successSpy } = setup();
    rpc.mockResolvedValue({ data: { id: 7 }, error: null });

    const result = await service.fetchRpc<{ id: number }>(
      'get_thing',
      { a: 1 },
      { errorContext: 'test data' },
    );

    expect(result).toEqual({ id: 7 });
    expect(rpc).toHaveBeenCalledWith('get_thing', { a: 1 });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(successSpy).not.toHaveBeenCalled();
  });

  it('returns null and toasts a failed-load message on an RPC error', async () => {
    const { service, rpc, errorSpy } = setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const result = await service.fetchRpc('get_thing', {}, { errorContext: 'players' });

    expect(result).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error loading players:', { message: 'boom' });
    expect(errorSpy).toHaveBeenCalledWith('Failed to load players', 'Error');
  });

  it('uses the provided error title on an RPC error', async () => {
    const { service, rpc, errorSpy } = setup();
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', errorTitle: 'Custom Title' },
    );

    expect(errorSpy).toHaveBeenCalledWith('Failed to load players', 'Custom Title');
  });

  it('returns null without toasting when showErrorToast is false on an RPC error', async () => {
    const { service, rpc, errorSpy } = setup();
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', showErrorToast: false },
    );

    expect(result).toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('returns null and toasts an unexpected-error message when rpc throws', async () => {
    const { service, rpc, errorSpy } = setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const thrown = new Error('network down');
    rpc.mockRejectedValue(thrown);

    const result = await service.fetchRpc('get_thing', {}, { errorContext: 'players' });

    expect(result).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Unexpected error:', thrown);
    expect(errorSpy).toHaveBeenCalledWith(
      'An unexpected error occurred while loading players',
      'Error',
    );
  });

  it('returns null without toasting when showErrorToast is false and rpc throws', async () => {
    const { service, rpc, errorSpy } = setup();
    rpc.mockRejectedValue(new Error('network down'));

    const result = await service.fetchRpc(
      'get_thing',
      {},
      { errorContext: 'players', showErrorToast: false },
    );

    expect(result).toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
