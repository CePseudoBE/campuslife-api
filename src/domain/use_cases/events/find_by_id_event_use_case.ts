import { inject } from '@adonisjs/core'
import { IEventRepository } from '#domain/repositories/ievent_repository'
import { Event } from '#domain/entities/event'

@inject()
export class FindByIdEventUseCase {
  constructor(private iEventRepository: IEventRepository) {}

  public async handle(data: {
    id: number
    connected: boolean
    includes?: string[]
  }): Promise<Event | null> {
    return await this.iEventRepository.findById(data.id, data.connected, data.includes)
  }
}
