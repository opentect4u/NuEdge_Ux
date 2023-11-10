import { TestBed } from '@angular/core/testing';

import { GaurdChildGuard } from './gaurd-child.guard';

describe('GaurdChildGuard', () => {
  let guard: GaurdChildGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GaurdChildGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
