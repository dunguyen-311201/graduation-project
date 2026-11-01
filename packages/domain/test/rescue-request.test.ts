import {describe, expect, it} from 'vitest';
import {
  AlreadyClaimedError,
  InvalidTransitionError,
  isActive,
  REQUEST_STATUSES,
  RescueRequest,
  TRANSITIONS,
} from '../src/index.js';

const at = (status: (typeof REQUEST_STATUSES)[number]) =>
  RescueRequest.restore({id: 'r1', requesterId: 'u1', status, claimedByCenterId: null});

describe('RescueRequest state machine (INV-05)', () => {
  for (const from of REQUEST_STATUSES) {
    for (const to of REQUEST_STATUSES) {
      const allowed = TRANSITIONS[from].includes(to);
      it(`${from} -> ${to} is ${allowed ? 'allowed' : 'rejected'}`, () => {
        const request = at(from);
        if (allowed) {
          request.transition(to);
          expect(request.snapshot.status).toBe(to);
        } else {
          expect(() => request.transition(to)).toThrow(InvalidTransitionError);
          expect(request.snapshot.status).toBe(from);
        }
      });
    }
  }

  it('treats only non-terminal states as active (INV-01)', () => {
    expect(REQUEST_STATUSES.filter(isActive)).toEqual(['PENDING', 'CLAIMED', 'ASSIGNED', 'IN_PROGRESS']);
  });
});

describe('claim (INV-02)', () => {
  it('starts pending and unclaimed', () => {
    expect(RescueRequest.raise('r1', 'u1').snapshot).toEqual({
      id: 'r1',
      requesterId: 'u1',
      status: 'PENDING',
      claimedByCenterId: null,
    });
  });

  it('records the first center and accepts a repeat from it', () => {
    const request = RescueRequest.raise('r1', 'u1');
    request.claim('c1');
    request.claim('c1');
    expect(request.snapshot).toMatchObject({status: 'CLAIMED', claimedByCenterId: 'c1'});
  });

  it('rejects a second center', () => {
    const request = RescueRequest.raise('r1', 'u1');
    request.claim('c1');
    expect(() => request.claim('c2')).toThrow(AlreadyClaimedError);
  });

  it('cannot claim a request that has ended', () => {
    expect(() => at('EXPIRED').claim('c1')).toThrow(InvalidTransitionError);
  });
});
