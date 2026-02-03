'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Diagnostic } from '../types'
import { groupByDate } from '../utils'

interface TimelineChartProps {
  diagnostics: Diagnostic[]
}

export default function TimelineChart({ diagnostics }: TimelineChartProps) {
  const grouped = groupByDate(diagnostics)
  
  const sortedDates = Object.keys(grouped).sort()
  
  const data = sortedDates.map(date => {
    const d = new Date(date)
    return {
      date,
      label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      count: grouped[date],
    }
  })

  let cumulative = 0
  const dataWithCumulative = data.map(d => {
    cumulative += d.count
    return { ...d, cumulative }
  })

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { date: string; count: number; cumulative: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const date = new Date(item.date)
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">
            {date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
          </p>
          <p className="text-[#6B6560]">{item.count} nouveau{item.count > 1 ? 'x' : ''}</p>
          <p className="text-[#9B8F85] text-sm">Total: {item.cumulative}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Timeline des Inscriptions</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataWithCumulative} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9B71" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF9B71" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" vertical={false} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: '#6B6560', fontSize: 11 }}
              axisLine={{ stroke: '#E8E4DF' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6B6560', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#FF9B71" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
