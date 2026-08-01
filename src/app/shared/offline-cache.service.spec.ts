import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OfflineCacheService } from './offline-cache.service';

describe('OfflineCacheService', () => {
  const KEY = 'offline-cache:test';

  afterEach(() => {
    localStorage.removeItem(KEY);
  });

  it('returns null for a key that was never written', () => {
    const service = TestBed.inject(OfflineCacheService);
    expect(service.read('test')).toBeNull();
  });

  it('round-trips a value through localStorage', () => {
    const service = TestBed.inject(OfflineCacheService);
    service.write('test', { hello: 'world' });
    expect(service.read('test')).toEqual({ hello: 'world' });
  });

  it('overwrites the previous value on each write', () => {
    const service = TestBed.inject(OfflineCacheService);
    service.write('test', { version: 1 });
    service.write('test', { version: 2 });
    expect(service.read('test')).toEqual({ version: 2 });
  });

  it('returns null instead of throwing on corrupted JSON', () => {
    localStorage.setItem(KEY, '{not valid json');
    const service = TestBed.inject(OfflineCacheService);
    expect(service.read('test')).toBeNull();
  });

  it('does nothing on the server, where localStorage does not exist', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const service = TestBed.inject(OfflineCacheService);

    service.write('test', { hello: 'world' });

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(service.read('test')).toBeNull();
  });
});
