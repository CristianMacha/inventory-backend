export const WORKSHOP_TOKENS = {
  TOOL_REPOSITORY: Symbol('WorkshopToolRepository'),
  MATERIAL_REPOSITORY: Symbol('WorkshopMaterialRepository'),
  CATEGORY_REPOSITORY: Symbol('WorkshopCategoryRepository'),
  SUPPLIER_REPOSITORY: Symbol('WorkshopSupplierRepository'),
  MATERIAL_MOVEMENT_REPOSITORY: Symbol('WorkshopMaterialMovementRepository'),
  TOOL_MOVEMENT_REPOSITORY: Symbol('WorkshopToolMovementRepository'),
} as const;
