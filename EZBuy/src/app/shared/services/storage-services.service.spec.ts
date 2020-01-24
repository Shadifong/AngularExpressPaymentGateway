import { TestBed } from '@angular/core/testing';

import { StorageServicesService } from './storage-services.service';

describe('StorageServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageServicesService = TestBed.get(StorageServicesService);
    expect(service).toBeTruthy();
  });
});
