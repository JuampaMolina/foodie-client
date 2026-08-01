import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  orderCreatedRemotely,
  orderStatusChangedRemotely,
} from '../modules/orders/store/orders.actions';
import { selectToken } from '../modules/users/store/users.selectors';
import { RealtimeService, SOCKET_IO_FACTORY } from './realtime.service';

describe('RealtimeService', () => {
  let fakeSocket: jasmine.SpyObj<any>;
  let ioFactory: jasmine.Spy;
  let handlers: Record<string, (...args: any[]) => void>;

  const configureWithToken = (token: string | undefined) => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: selectToken, value: token }],
        }),
        { provide: SOCKET_IO_FACTORY, useValue: ioFactory },
      ],
    });
  };

  beforeEach(() => {
    handlers = {};
    fakeSocket = jasmine.createSpyObj('Socket', ['on', 'disconnect']);
    fakeSocket.on.and.callFake(
      (event: string, handler: (...args: any[]) => void) => {
        handlers[event] = handler;
      }
    );
    ioFactory = jasmine.createSpy('io').and.returnValue(fakeSocket);
  });

  it('does not connect when there is no token', () => {
    configureWithToken(undefined);
    TestBed.inject(RealtimeService);
    TestBed.flushEffects();
    expect(ioFactory).not.toHaveBeenCalled();
  });

  it('connects with the token once one is available', () => {
    configureWithToken('abc123');
    TestBed.inject(RealtimeService);
    TestBed.flushEffects();
    expect(ioFactory).toHaveBeenCalledWith(jasmine.any(String), {
      auth: { token: 'abc123' },
    });
  });

  it('dispatches orderCreatedRemotely when an order:new event arrives', () => {
    configureWithToken('abc123');
    TestBed.inject(RealtimeService);
    TestBed.flushEffects();

    const store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    const order = { _id: '1' } as any;
    handlers['order:new'](order);

    expect(store.dispatch).toHaveBeenCalledWith(
      orderCreatedRemotely({ order })
    );
  });

  it('dispatches orderStatusChangedRemotely when an order:status-changed event arrives', () => {
    configureWithToken('abc123');
    TestBed.inject(RealtimeService);
    TestBed.flushEffects();

    const store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    const order = { _id: '1', status: 'preparing' } as any;
    handlers['order:status-changed'](order);

    expect(store.dispatch).toHaveBeenCalledWith(
      orderStatusChangedRemotely({ order })
    );
  });

  it('disconnects the socket when the token disappears (logout)', () => {
    configureWithToken('abc123');
    TestBed.inject(RealtimeService);
    TestBed.flushEffects();

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectToken, undefined);
    store.refreshState();
    TestBed.flushEffects();

    expect(fakeSocket.disconnect).toHaveBeenCalled();
  });
});
