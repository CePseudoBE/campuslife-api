import { StibShape } from '#domain/entities/stib_shape'

export abstract class IStibShapeService {
  /**
   * Méthode abstraite pour récupérer des shapes STIB depuis une API ou toute autre source de données.
   * @param limit Le nombre de résultats à récupérer.
   * @param offset Le décalage à utiliser pour la pagination.
   * @returns Un tableau de DTO StibShape.
   */
  abstract fetchStibShapes(limit: number): Promise<StibShape[]>
}
