import { useState } from 'react'
import Button from '../ui/Button'

export default function KidsAgeInput({ value = [], onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    const age = parseInt(input, 10)
    if (!isNaN(age) && age >= 0 && age <= 17 && !value.includes(age)) {
      onChange([...value, age].sort((a, b) => a - b))
    }
    setInput('')
  }

  const remove = (age) => onChange(value.filter((a) => a !== age))

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-app-text">Kids' ages</label>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          max="17"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Age in years"
          className="flex-1 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Button type="button" onClick={add} variant="secondary" size="md">Add</Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => remove(age)}
              className="flex items-center gap-1 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {age}y <span>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
