export class Waypoint {
  public id: number
  public latitude: number
  public longitude: number
  public title: Record<string, string> // Représentation des données JSON pour les titres dans plusieurs langues
  public description?: Record<string, string> // Peut être nullable
  public types: string
  public pmr: boolean
  public slug?: string // Peut être nullable
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    latitude: number,
    longitude: number,
    title: Record<string, string>,
    types: string = 'default',
    pmr: boolean = false,
    createdAt: Date,
    updatedAt: Date,
    description?: Record<string, string>,
    slug?: string
  ) {
    this.id = id
    this.latitude = latitude
    this.longitude = longitude
    this.title = title
    this.types = types
    this.pmr = pmr
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.description = description
    this.slug = slug
  }
}
