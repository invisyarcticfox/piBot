import type { Request, Response } from 'express'
import { readSeenFile } from '../../../utils'
import { seenData, seenFileData } from '../../types'


export async function getStats(req:Request, res:Response) {
  try {
    const data:seenData = await readSeenFile()
    const counts:seenFileData = {}

    Object.values(data).forEach((entry) => {
      const type = entry.type
      if (!counts[type]) counts[type] = { total:0, unique:new Set() }

      counts[type].total += entry.seenCount
      counts[type].unique.add(entry.reg)
    })

    const countParam = req.query.c || req.query.count
    const topCount = typeof countParam === 'string' ? parseInt(countParam, 10) : 5
    const sliceCount = isNaN(topCount) ? 5 : topCount

    const top = Object.entries(counts)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, sliceCount)
      .map(([type, info]) => ({
        type,
        total: info.total,
        unique: info.unique.size
      }))
    
    return res.status(200).json(top)
  } catch (error) {
    console.error(error)
  }
}