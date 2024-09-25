// src/domain/entities/Waypoint.ts

export class Waypoint {
  public id: number
  public latitude: number
  public longitude: number
  public title: Record<string, string> // Représentation du JSON pour le titre
  public description?: Record<string, string> // Représentation du JSON pour la description (nullable)
  public types: string
  public pmr: boolean
  public slug?: string
  public tags?: string[] // Liste des tags (ou autres objets si nécessaire)
  public events?: string[] // Liste des événements associés (ou autres objets si nécessaire)
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    latitude: number,
    longitude: number,
    title: Record<string, string>,
    types: string,
    pmr: boolean,
    createdAt: Date,
    updatedAt: Date,
    description?: Record<string, string>,
    slug?: string,
    tags?: string[],
    events?: string[]
  ) {
    this.id = id
    this.latitude = latitude
    this.longitude = longitude
    this.title = title
    this.description = description
    this.types = types
    this.pmr = pmr
    this.slug = slug
    this.tags = tags
    this.events = events
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
