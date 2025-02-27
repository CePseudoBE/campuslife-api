import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'

@inject()
export class FindWaypointsUseCase {
  constructor(
    private iwaypointrepository: IWaypointRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Waypoint[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      { page, limit, order, column },
      { allowedColumns: Waypoint.allowedColumns }
    )
    return await this.iwaypointrepository.findAll(queryParams, includes, deleted)
  }
}
