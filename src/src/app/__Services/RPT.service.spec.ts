/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RPTService } from './RPT.service';

describe('Service: RPT', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RPTService]
    });
  });

  it('should ...', inject([RPTService], (service: RPTService) => {
    expect(service).toBeTruthy();
  }));
});
