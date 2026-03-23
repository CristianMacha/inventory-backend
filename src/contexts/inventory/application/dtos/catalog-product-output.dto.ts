export interface CatalogSlabOutputDto {
  id: string;
  code: string;
  widthCm: number;
  heightCm: number;
  status: string;
}

export interface CatalogBundleOutputDto {
  id: string;
  lotNumber: string;
  thicknessCm: number;
  imagePublicId: string | null;
  slabs: CatalogSlabOutputDto[];
}

export interface CatalogProductOutputDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: { id: string; name: string };
  level: { id: string; name: string };
  finish: { id: string; name: string };
  brand?: { id: string; name: string };
}

export interface CatalogProductDetailOutputDto extends CatalogProductOutputDto {
  bundles: CatalogBundleOutputDto[];
}
