import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class FindTagsUseCase {
  constructor(
    private iTagsRepository: ITagRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Tag[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      Tag
    )
    return await this.iTagsRepository.findAll(queryParams, includes, deleted)
  }
}
