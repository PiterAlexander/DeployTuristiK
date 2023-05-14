import { TestBed } from '@angular/core/testing';

import { AssociatedPermissionService } from './associated-permission.service';

describe('AssociatedPermissionService', () => {
  let service: AssociatedPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociatedPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
