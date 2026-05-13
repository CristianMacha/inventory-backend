export class OrganizationDto {
  id: string;
  name: string;
  storageLimitBytes: number;
  storageUsedBytes: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
