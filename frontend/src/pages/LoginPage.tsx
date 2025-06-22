import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object({
  email:    yup.string().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: yupResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await login(data.email, data.password);
      toast.success("Logged in!");
      nav("/");
    } catch {
      toast.error("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Log In</h1>
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? "Logging in…" : "Log In"}
      </button>
      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <Link to="/auth/signup" className="text-green-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
