import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"

interface Props {
    label: string
    placeholder: string,
    type: React.HTMLInputTypeAttribute,
    id: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function InputWithLabel(props: Props) {
    return (
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={props.id}>{props.label}</Label>
            <Input type={props.type} id={props.id} placeholder={props.placeholder} onChange={props.onChange}/>
        </div>  
    )
}
