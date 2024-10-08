export class StibShape {
  public id: number | null
  public ligne: string
  public colorHex: string
  public createdAt: Date
  public updatedAt: Date

  constructor(id: number, ligne: string, colorHex: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.ligne = ligne
    this.colorHex = colorHex
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
