"use client"

import { useMemo, useState } from 'react'

type EventItem = { id: string; title: string; event_date: string; location?: string }

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export default function Calendar({ events }: { events: EventItem[] }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    events.forEach((e) => {
      const key = new Date(e.event_date).toISOString().slice(0, 10)
      const arr = map.get(key) || []
      arr.push(e)
      map.set(key, arr)
    })
    return map
  }, [events])

  const days = [] as Date[]
  const start = startOfMonth(visibleMonth)
  const end = endOfMonth(visibleMonth)
  const startWeekDay = start.getDay()
  for (let i = 0; i < startWeekDay; i++) days.push(new Date(start.getFullYear(), start.getMonth(), i - startWeekDay + 1))
  for (let d = 1; d <= end.getDate(); d++) days.push(new Date(start.getFullYear(), start.getMonth(), d))
  while (days.length % 7 !== 0) days.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + (days.length % 7)))

  const prevMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))
  const nextMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))

  const closeModal = () => setSelectedDate(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="px-3 py-1 border rounded">←</button>
        <div className="font-semibold">{visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button onClick={nextMonth} className="px-3 py-1 border rounded">→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d) => (
          <div key={d} className="font-medium text-muted-foreground">{d}</div>
        ))}

        {days.map((dt, idx) => {
          const key = dt.toISOString().slice(0, 10)
          const dayEvents = eventsByDate.get(key) || []
          const isCurrentMonth = dt.getMonth() === visibleMonth.getMonth()
          return (
            <button
              key={idx}
              onClick={() => dayEvents.length && setSelectedDate(key)}
              className={`p-2 rounded border h-14 flex flex-col items-center justify-center ${isCurrentMonth ? '' : 'text-muted-foreground'} ${dayEvents.length ? 'bg-yellow-50 border-yellow-200' : ''}`}
            >
              <div className="text-sm">{dt.getDate()}</div>
              {dayEvents.length > 0 && <div className="text-xs text-muted-foreground mt-1">{dayEvents.length} event</div>}
            </button>
          )
        })}
      </div>

      {/* Modal */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded p-6 z-10 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Events on {selectedDate}</h4>
              <button onClick={closeModal} className="text-muted-foreground">✕</button>
            </div>
            <div className="space-y-3">
              {(eventsByDate.get(selectedDate) || []).map((e) => (
                <div key={e.id} className="p-3 border rounded">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-sm text-muted-foreground">{new Date(e.event_date).toLocaleString()}</div>
                  {e.location && <div className="text-sm">{e.location}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
