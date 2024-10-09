import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'
import { ISlugService } from '#domain/services/islug_service'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'

@inject()
export class CreateWaypointUseCase {
  constructor(
    private iWaypointRepository: IWaypointRepository,
    private iTagRepository: ITagRepository,
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
    tags?: number[]
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
      throw new Error('Title is required')
    }

    // Génération d'un slug unique
    let slug = this.iSlugService.generate(data.title_en)
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

    // Si aucun tag n'est fourni, créer le waypoint sans association de tags
    if (!data.tags || data.tags.length === 0) {
      return await this.iWaypointRepository.create(waypoint)
    }

    // Validation des tags
    if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
      throw new Error('Invalid tag format: tags must be an array of numbers')
    }

    // Vérification de l'existence des tags
    for (const tagId of data.tags) {
      const tag = await this.iTagRepository.findById(tagId)
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} does not exist`)
      }
    }

    // Création du waypoint dans la base de données
    const waypointFromRepo = await this.iWaypointRepository.create(waypoint)

    // Association des tags avec le waypoint
    return await this.iWaypointRepository.associateTags(data.tags, waypointFromRepo)
  }
}
