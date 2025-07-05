import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as React from "react"

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export default function InputWithLabel({ label, id, ...props }: InputWithLabelProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}
