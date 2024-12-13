import { inject } from '@adonisjs/core'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { ITagRepository } from '#domain/repositories/itag_repository'

@inject()
export class FindWaypointsByCollectionUseCase {
  constructor(
    private waypointRepository: IWaypointRepository,
    private tagRepository: ITagRepository
  ) {}

  public async handle(collectionId: number): Promise<any[]> {
    const tags = await this.tagRepository.findByCollectionId(collectionId)

    if (!tags.length) {
      return []
    }

    const tagIds = tags.map((tag) => tag.id).filter((id): id is number => id !== null)

    return await this.waypointRepository.findByTagIds(tagIds)
  }
}
