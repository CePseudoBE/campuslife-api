import env from '#infrastructure/adonis/env'
import { IStibShapeService } from '#domain/services/istib_shape_service'
import { StibShape } from '#domain/entities/stib_shape'

export class StibShapeService extends IStibShapeService {
  private apiUrl =
    'https://data.stib-mivb.brussels/api/explore/v2.1/catalog/datasets/shapefiles-production/records'

  public async fetchStibShapes(limit: number = 100): Promise<StibShape[]> {
    const apiKey = env.get('STIB_KEY')
    let offset = 0
    let totalCount = 0
    let allResults: StibShape[] = []

    do {
      const response = await fetch(
        `${this.apiUrl}?limit=${limit}&offset=${offset}&apikey=${apiKey}`
      )
      const data = (await response.json()) as ApiResponse

      totalCount = data.total_count
      const stibShapes = this.toDTO(data.results as StibShapeAPI[])
      allResults = allResults.concat(stibShapes)

      offset += limit
    } while (offset < totalCount)

    return allResults
  }

  private toDTO(stibShapes: StibShapeAPI[]): StibShape[] {
    return stibShapes.map((shape) => {
      return {
        id: null,
        ligne: shape.ligne,
        colorHex: shape.color_hex,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
}

interface Geo2DPoint {
  lat: number
  lon: number
}

interface GeoShape {
  type: string
  geometry: any
  properties: {}
}

export interface StibShapeAPI {
  geo_point_2d: Geo2DPoint
  geo_shape: GeoShape
  ligne: string
  variante: number
  color_hex: string
  date_debut: string
  date_fin: string
}

interface ApiResponse {
  total_count: number
  results: Array<StibShapeAPI>
}
