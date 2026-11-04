import { NextResponse } from 'next/server'
import { openrag } from '@/lib/openrag'
import { getNotebooks } from '@/lib/store'
import { mapSdkError } from '@/lib/errors'

export async function GET() {
  try {
    const managedIds = new Set(getNotebooks().map(nb => nb.openragFilterId))
    let filters: any[] = []
    try {
      filters = await openrag.knowledgeFilters.search(undefined, 100)
    } catch {
      // Fallback cleanly if remote OpenRAG instance is unconfigured
      filters = []
    }

    const available = filters
      .filter(f => !managedIds.has(f.id))
      .map(f => {
        const dataSources = f.queryData?.filters?.data_sources ?? []
        return {
          id: f.id,
          name: f.name,
          description: f.description ?? '',
          documentCount: dataSources.length,
          dataSources,
        }
      })

    return NextResponse.json({ filters: available })
  } catch (e) {
    return NextResponse.json({ filters: [] })
  }
}
