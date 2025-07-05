import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthImage from "@/assets/auth-image.jpg";
import Logo from "@/assets/logo.png";
import { InputFormRegister } from "./components/InputFormRegister";
import { InputFormLogin } from "./components/InputFormLogin";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AuthPage = () => {
    // TODO: Replace with your actual auth logic
    const user: unknown = null;
    const location = useLocation();
    const navigate = useNavigate();
    const defaultTab = new URLSearchParams(location.search).get("type") || "login";

    const handleTabChange = (value: string) => {
        navigate(`?type=${value}`, { replace: true });
    };
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="h-screen w-screen flex justify-between">
            <div className="flex-1 flex flex-col px-10 pt-5">
                <div className="flex justify-center sm:block  ">
                    <img onClick={() => navigate("/")} src={Logo} alt="Logo" className="w-16" />
                </div>
                <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="pt-14">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="login">
                            Login
                        </TabsTrigger>
                        <TabsTrigger className="w-full" value="signup">
                            Sign up
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <InputFormLogin />
                    </TabsContent>
                    <TabsContent value="signup">
                        <InputFormRegister />
                    </TabsContent>
                </Tabs>
            </div>
            <img src={AuthImage} alt="Langing Image" className="hidden sm:block h-full max-w-[65%]" />
        </div>
    );
};

export default AuthPage;
