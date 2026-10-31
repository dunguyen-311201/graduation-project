# ADR-0006: Geohash center matching with a stepped radius

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** DSP-01, DSP-02, DSP-07

## Context

The system currently loads every `available` center, filters by matching `city` name, then checks a 10 km radius with geolib. People near a province border get no help even when a center is 2 km away; city names from the Geocoding API are unstable; loading the whole collection does not scale.

## Decision

Store a `geohash` (precision 9) for each center using `geofire-common`. Query by the geohash ranges covering the radius (`geohashQueryBounds`), re-filter by true distance, sort ascending, and take at most 5 `APPROVED` centers with `availableResponders > 0`. The radius starts at 10 km and expands to 20 km then 50 km when there are no candidates, when 60 seconds pass without a claim, or immediately when severity ≥ 4.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Geohash + geofire-common (chosen) | Works on Firestore; officially documented by Firebase | Several parallel queries per circle; must re-filter |
| Filter by province/city | Simple | Wrong at borders; depends on address strings |
| Load all and filter in the function | Simple | Does not scale; costly reads |
| PostGIS / Elasticsearch | Powerful | Extra infrastructure; contradicts ADR-0001 |

## Consequences

- Positive: geographically correct; reads scale with the number of centers in the area.
- Negative: needs a composite index `registrationStatus + geohash`; geohash backfill for existing data.
- Follow-up: `CenterMatchingPolicy` is a pure domain service that receives candidates with distances, so tests need no Firestore.
