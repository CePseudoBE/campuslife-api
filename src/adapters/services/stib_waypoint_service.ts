import { IStibWaypointService } from '#domain/services/istib_waypoint_service'
import { Waypoint } from '#domain/entities/waypoint'
import env from '#infrastructure/adonis/env'
import { ISlugService } from '#domain/services/islug_service'
import { inject } from '@adonisjs/core' // Assuming you have this service

interface ApiResponse {
  total_count: number
  results: Array<{
    gpscoordinates: string
    id: string
    name: string
  }>
}

const campus = [
  {
    latitude: 50.81344002067616,
    longitude: 4.382174827446911,
    meter: 750,
  },
  {
    latitude: 50.82152533476256,
    longitude: 4.397059078683504,
    meter: 750,
  },
  {
    latitude: 50.82798916428813,
    longitude: 4.374001578739861,
    meter: 250,
  },
  {
    latitude: 50.81379225398775,
    longitude: 4.265764898273593,
    meter: 750,
  },
  {
    latitude: 50.82275666927069,
    longitude: 4.386294225967434,
    meter: 250,
  },
]

@inject()
export class StibWaypointService extends IStibWaypointService {
  constructor(private iSlugService: ISlugService) {
    super()
  }

  async fetchStib(): Promise<Waypoint[]> {
    const limit = 100
    let offset = 0
    let totalCount = 0
    let allResults: Array<{
      gpscoordinates: string
      id: string
      name: string
    }> = []

    // Fetch data from STIB API in paginated form
    do {
      const apiKey = env.get('STIB_KEY')
      const response = await fetch(
        `https://data.stib-mivb.brussels/api/explore/v2.1/catalog/datasets/stop-details-production/records?limit=${limit}&offset=${offset}&apikey=${apiKey}`
      )

      const data = (await response.json()) as ApiResponse
      totalCount = data.total_count

      // Collect results from the API response
      const results = data.results.map((result) => ({
        gpscoordinates: result.gpscoordinates,
        id: result.id,
        name: result.name,
      }))

      allResults = allResults.concat(results)
      offset += limit
    } while (offset < totalCount)

    return this.filterWaypoints(allResults)
  }

  private filterWaypoints(
    results: Array<{ gpscoordinates: string; id: string; name: string }>
  ): Waypoint[] {
    const filteredWaypoints: Waypoint[] = []

    for (const result of results) {
      const coordinates = JSON.parse(result.gpscoordinates)

      // Check if the waypoint is within any campus range
      const isInRange = campus.some((campusPoint) => {
        const distance = this.calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          campusPoint.latitude,
          campusPoint.longitude
        )
        return distance <= campusPoint.meter
      })

      if (isInRange) {
        const waypoint = this.mapResultToWaypoint(result, coordinates)
        filteredWaypoints.push(waypoint)
      }
    }

    return filteredWaypoints
  }

  private mapResultToWaypoint(
    result: { id: string; name: string },
    coordinates: { latitude: number; longitude: number }
  ): Waypoint {
    const name = JSON.parse(result.name)
    const jsonTitle = { fr: name.fr, en: name.fr }
    const jsonDesc = { fr: `Arrêt : ${name.fr}`, en: `Stop : ${name.fr}` }

    // Generate a slug using the slug service
    const slug = this.iSlugService.generate(name.fr)

    return new Waypoint(
      null, // ID is null for a new Waypoint
      coordinates.latitude,
      coordinates.longitude,
      jsonTitle,
      'stib', // type of waypoint
      true, // PMR enabled
      new Date(), // createdAt
      new Date(), // updatedAt
      null, // deletedAt
      jsonDesc, // Description
      slug // Slug
    )
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }
}
