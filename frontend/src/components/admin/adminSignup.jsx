import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";


const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().min(6)
})

    .required();


export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                "https://movie-rating-and-review.onrender.com/api/v1/admin/signup",
                data,
                {
                    withCredentials: true,
                },
            );
               const success = res.data.message;
               console.log(success);

               if (success === "signed Up!") {
                navigate("/admin_2156/signin", { replace: true });
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
                {...register("name")}
                placeholder="name"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            
            <input
                {...register("email")}
                placeholder="email"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            
            <input
                {...register("password")}
                placeholder="password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            <input type="submit" className="rounded-md border-4 bg-blue-500 mt-5 py-1 text-white" />
            <p className="flex text-white justify-between">
                already signed-up{" "}
                <Link to="/admin_2156/signin" className="text-white underline"  >
                    Sign In
                </Link>
            </p>

        </form>
    );

};