// App/Domain/Services/QueryValidationService.ts

export interface QueryParams {
  page?: number
  limit?: number
  order?: 'asc' | 'desc'
  column?: string
}

export class QueryValidationService {
  private maxLimit: number = 100

  public validateAndSanitizeQueryParams(
    params: QueryParams,
    entity: { allowedColumns: string[] }
  ): QueryParams {
    return {
      page: this.validatePage(params.page),
      limit: this.validateLimit(params.limit),
      order: this.validateOrder(params.order),
      column: this.validateColumn(entity.allowedColumns, params.column),
    }
  }

  private validatePage(page?: number): number {
    return page && page > 0 ? Math.floor(page) : 1
  }

  private validateLimit(limit?: number): number {
    if (limit && limit > 0 && limit <= this.maxLimit) {
      return Math.floor(limit)
    }
    return 10
  }

  private validateOrder(order?: string): 'asc' | 'desc' {
    return order === 'asc' ? 'asc' : 'desc'
  }

  private validateColumn(allowedColumns: string[], column?: string): string {
    return allowedColumns.includes(column!) ? column! : 'created_at'
  }
}
