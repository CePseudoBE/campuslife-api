import { inject } from '@adonisjs/core'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibShape } from '#domain/entities/stib_shape'
import { IStibShapeService } from '#domain/services/istib_shape_service'

@inject()
export class SeedStibsUseCase {
  constructor(
    private iStibRepository: IStibRepository,
    private iStibShapeService: IStibShapeService
  ) {}

  public async handle(): Promise<StibShape[]> {
    const stibs = await this.iStibShapeService.fetchStibShapes(100)

    const results: StibShape[] = []

    for (const stib of stibs) {
      let stibFromRepo: StibShape

      try {
        stibFromRepo = await this.iStibRepository.findByName(stib.ligne)
      } catch (error) {
        stibFromRepo = await this.iStibRepository.create(stib)
      }

      results.push(stibFromRepo)
    }

    return results
  }
}
