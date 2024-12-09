import { inject } from '@adonisjs/core'
import { IEventRepository } from '#domain/repositories/ievent_repository'

@inject()
export class DeleteEventUseCase {
  constructor(private iEventRepository: IEventRepository) {}

  public async handle(id: number): Promise<null> {
    const event = await this.iEventRepository.findById(id, false)
    if (!event) {
      throw new Error(`NotFound: Event with id ${id} not found`)
    }
    event.delete()
    return await this.iEventRepository.delete(event)
  }
}
