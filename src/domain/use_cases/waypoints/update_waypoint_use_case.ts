import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'
import { ISlugService } from '#domain/services/islug_service'

@inject()
export class UpdateWaypointUseCase {
  constructor(
    private iWaypointRepository: IWaypointRepository,
    private iSlugService: ISlugService
  ) {}

  public async handle(
    id: number,
    data: {
      latitude?: number
      longitude?: number
      title_en?: string
      title_fr?: string
      description_en?: string
      description_fr?: string
      types?: string
      slug?: string
      pmr?: boolean
    }
  ): Promise<Waypoint> {
    const existingWaypoint = await this.iWaypointRepository.findById(id)
    if (!existingWaypoint) {
      throw new Error('Waypoint not found')
    }

    let slug = existingWaypoint.slug
    if (data.title_en && data.title_en !== existingWaypoint.title.en) {
      slug = this.iSlugService.generate(data.title_en)

      let check = await this.iWaypointRepository.findBySlug(slug)
      let iterationCount = 0
      const maxIterations = 10

      while (check && iterationCount < maxIterations) {
        slug = this.iSlugService.slugWithRandom(slug)
        check = await this.iWaypointRepository.findBySlug(slug)
        iterationCount++
      }

      if (iterationCount === maxIterations) {
        throw new Error('MaxIteration: Unable to generate unique slug after several attempts')
      }

      data = {
        ...data,
        slug: slug,
      }
    }

    existingWaypoint.update(data)

    return await this.iWaypointRepository.update(existingWaypoint)
  }
}
