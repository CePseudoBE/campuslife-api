export class StibShape {
  public id: number | null
  public ligne: string
  public colorHex: string
  public createdAt: Date
  public updatedAt: Date

  public static allowedColumns: string[] = ['id', 'ligne', 'colorHex', 'createdAt', 'updatedAt']

  constructor(id: number, ligne: string, colorHex: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.ligne = ligne
    this.colorHex = colorHex
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
