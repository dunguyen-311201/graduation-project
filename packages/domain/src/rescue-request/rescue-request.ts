import {canTransition, type RequestStatus} from './transitions.js';

export class InvalidTransitionError extends Error {
  readonly code = 'INVALID_TRANSITION';

  constructor(
    readonly from: RequestStatus,
    readonly to: RequestStatus,
  ) {
    super(`Cannot move a request from ${from} to ${to}`);
  }
}

export class AlreadyClaimedError extends Error {
  readonly code = 'ALREADY_CLAIMED';

  constructor() {
    super('Request already claimed by another center');
  }
}

export interface RescueRequestState {
  id: string;
  requesterId: string;
  status: RequestStatus;
  claimedByCenterId: string | null;
}

export class RescueRequest {
  private constructor(private state: RescueRequestState) {}

  static raise(id: string, requesterId: string) {
    return new RescueRequest({id, requesterId, status: 'PENDING', claimedByCenterId: null});
  }

  static restore(state: RescueRequestState) {
    return new RescueRequest({...state});
  }

  get snapshot(): Readonly<RescueRequestState> {
    return {...this.state};
  }

  transition(to: RequestStatus) {
    if (!canTransition(this.state.status, to)) {
      throw new InvalidTransitionError(this.state.status, to);
    }
    this.state.status = to;
  }

  /** INV-02. Claiming again as the same center is a no-op (LLD section 4). */
  claim(centerId: string) {
    if (this.state.claimedByCenterId === centerId) return;
    if (this.state.claimedByCenterId !== null) throw new AlreadyClaimedError();
    this.transition('CLAIMED');
    this.state.claimedByCenterId = centerId;
  }
}
