import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { Collection } from '#domain/entities/collection'

@inject()
export class FindCollectionsUseCase {
  constructor(
    private iCollectionRepository: ICollectionRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Collection[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Collection.allowedColumns }
    )
    return await this.iCollectionRepository.findAll(queryParams, includes, deleted)
  }
}
