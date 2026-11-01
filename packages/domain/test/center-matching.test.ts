import {describe, expect, it} from 'vitest';
import {distanceKm, findCandidates, type CenterCandidate} from '../src/index.js';

const origin = {lat: 16, lng: 108};
// One degree of latitude is about 111 km.
const center = (id: string, km: number, availableResponders = 1): CenterCandidate => ({
  id,
  location: {lat: 16 + km / 111.2, lng: 108},
  availableResponders,
  dispatcherIds: [id],
});

describe('distanceKm', () => {
  it('measures one degree of latitude as about 111 km', () => {
    expect(distanceKm(origin, {lat: 17, lng: 108})).toBeCloseTo(111.2, 0);
  });
});

describe('findCandidates', () => {
  it('stays at 10 km when a center is in range, nearest first', () => {
    const result = findCandidates(origin, [center('far', 9), center('near', 2), center('out', 30)]);
    expect(result.radiusKm).toBe(10);
    expect(result.candidates.map(c => c.id)).toEqual(['near', 'far']);
  });

  it('widens to the first radius with a match', () => {
    expect(findCandidates(origin, [center('c', 15)]).radiusKm).toBe(20);
    expect(findCandidates(origin, [center('c', 45)]).radiusKm).toBe(50);
  });

  it('skips centers with no free responder', () => {
    expect(findCandidates(origin, [center('busy', 1, 0)]).candidates).toEqual([]);
  });

  it('returns no candidates beyond 50 km', () => {
    expect(findCandidates(origin, [center('c', 80)])).toEqual({radiusKm: 50, candidates: []});
  });

  it('honours the limit', () => {
    const many = [1, 2, 3].map(km => center(`c${km}`, km));
    expect(findCandidates(origin, many, 2).candidates.map(c => c.id)).toEqual(['c1', 'c2']);
  });
});
