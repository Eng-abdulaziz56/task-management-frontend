import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import InputWithLabel from "@/components/input-with-label"
import { useState } from "react"
import { useForgetPassword } from "../api/hooks"
 
export default function ForgetPasswordDialog() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false)
    const { mutate: forgetPassword, isPending: loading } = useForgetPassword();

    function onSubmit() {
        if (loading) return;
        if (email === "") {
            setError("Email is required");
            return;
        }
        forgetPassword(email, {
            onSuccess: () => {
                setOpen(false);
                setEmail("");
                setError("");
            },
            onError: () => {
                setError("Failed to send reset email");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' className="underline text-primary p-0 hover:bg-transparent hover:text-primary">Forget Password?</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Forget Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <InputWithLabel label="Email" placeholder="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {error !== "" && <p className=" text-sm text-red-600">{error}</p>}
                </div>
                <DialogFooter>
                    <Button disabled={loading} type="button" className="w-full" onClick={onSubmit}>
                        {loading && <Loader2 className="animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


