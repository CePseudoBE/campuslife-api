export abstract class ISlugService {
  abstract generate(entire: string): string

  abstract slugWithRandom(slug: string): string
}
