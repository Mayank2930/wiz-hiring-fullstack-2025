import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object({
  name:     yup.string().required("Name is required"),
  email:    yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password required"),
  confirm:  yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: yupResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await signup(data.name, data.email, data.password);
      toast.success("Signed up!");
      nav("/");
    } catch {
      toast.error("Signup failed: email may be taken");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>

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

      <div>
        <input
          type="password"
          {...register("confirm")}
          placeholder="Confirm Password"
          className="w-full border p-2 rounded"
        />
        {errors.confirm && <p className="text-red-600 text-sm">{errors.confirm.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? "Signing up…" : "Create Account"}
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
