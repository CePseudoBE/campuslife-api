import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'

@inject()
export class WaypointTagsAssociateUseCase {
  constructor(
    private iWaypointRepository: IWaypointRepository,
    private iTagRepository: ITagRepository
  ) {}

  public async handle(data: { id: number; tags: number[] | undefined }): Promise<Waypoint> {
    if (!data.tags || data.tags.length === 0) {
      throw new Error('NoAssociation : 0 tags were provided, provide more tags')
    }

    // Validation des tags
    if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
      throw new Error('InvalidFormat: tags must be an array of numbers')
    }

    // Vérification de l'existence des tags
    for (const tagId of data.tags) {
      const tag = await this.iTagRepository.findById(tagId, false)
      if (!tag) {
        throw new Error(`NotFound: Tag with ID ${tagId} does not exist`)
      }
    }

    // Création du waypoint dans la base de données
    const waypoint = await this.iWaypointRepository.findById(data.id, false)

    if (!waypoint) {
      throw new Error(`NotFound: Waypoint with ID ${data.id} does not exist`)
    }

    // Association des tags avec le waypoint
    return await this.iWaypointRepository.associateTags(data.tags, waypoint)
  }
}
