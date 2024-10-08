import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'
import { ISlugService } from '#domain/services/islug_service'
import { MultilingualField } from '#domain/types/multilingual_field.type'

@inject()
export class CreateWaypointUseCase {
  constructor(
    private iwaypointrepository: IWaypointRepository,
    private iSlugService: ISlugService
  ) {}

  public async handle(data: {
    latitude: number
    longitude: number
    title_en: string
    title_fr: string
    description_en: string
    description_fr: string
    types: string
    pmr: boolean
  }): Promise<Waypoint> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }
    const description: MultilingualField = {
      en: data.description_en || '',
      fr: data.description_fr || '',
    }

    if (!data.title_en || !data.title_fr) {
      throw Error('Title is required')
    }

    let slug = this.iSlugService.generate(data.title_en)

    let check = await this.iwaypointrepository.findBySlug(slug)

    while (check) {
      slug = this.iSlugService.slugWithRandom(slug)
      check = await this.iwaypointrepository.findBySlug(slug)
    }

    const waypoint = new Waypoint(
      null,
      data.latitude,
      data.longitude,
      title,
      data.types,
      data.pmr,
      new Date(),
      new Date(),
      null,
      Object.keys(description).length > 0 ? description : undefined,
      slug
    )

    return await this.iwaypointrepository.create(waypoint)
  }
}
