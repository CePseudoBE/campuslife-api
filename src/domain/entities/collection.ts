import { Tag } from '#domain/entities/tag'

export class Collection {
  public id: number | null
  public name: string
  public heroicons: string
  public tags?: Tag[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number | null,
    name: string,
    heroicons: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    tags?: Tag[]
  ) {
    this.id = id
    this.name = name
    this.heroicons = heroicons
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.tags = tags
  }

  public delete() {
    this.deletedAt = new Date()
  }
}
