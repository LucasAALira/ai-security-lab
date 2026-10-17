import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const FILTER_ALL = 'todos'

interface Props {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { id: string; label: string }[]
}

/** Filtro de lista com opção "Todos". O valor `todos` significa "sem filtro". */
export function FilterSelect({ id, label, value, onChange, options }: Props) {
  return (
    <div className="min-w-0">
      <Label htmlFor={id} className="mb-1 text-[11px] text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>Todos</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
