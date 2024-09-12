import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6)
})

    .required();


export default function Signin() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });


    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                data,
                {
                    withCredentials: true,
                },
            );
            const success = await res.data.message;
            console.log(success);
            if (success === "Logged in!") {
                navigate("/admin/dashboard", { replace: true });
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2 rounded-md border p-6 min-w-[300px]"
        >
            <input
                {...register("email")}
                placeholder="email"
                className="block w-full rounded-lg border-4 border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            
            <input
                {...register("password")}
                placeholder="password"
                className="block w-full rounded-lg border-4 border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            <input type="submit" className="rounded-md border-4 mt-5 bg-blue-500 py-1 text-white" />
            <p className="flex text-white justify-between">
                not signed-up yet ? {" "}
                <Link to="/admin_2156/signup" className="text-white underline"  >
                    Sign Up
                </Link>
            </p>

        </form>
    );

};