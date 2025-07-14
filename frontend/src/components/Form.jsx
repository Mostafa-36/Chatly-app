import { createContext, useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

const FormContext = createContext();

export function Form({ children, onSubmit, defaultValues }) {
  const methods = useForm({ defaultValues });

  return (
    <FormContext.Provider value={methods}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {children}
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
}

Form.Field = function Field({ label, children }) {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div className="relative">{children}</div>
    </div>
  );
};

Form.Input = function Input({ name, type = "text", placeholder, icon: Icon }) {
  const { register } = useContext(FormContext);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-base-content/40" />
        </div>
      )}

      <input
        type={inputType}
        className="input input-bordered w-full pl-10 pr-10"
        placeholder={placeholder}
        {...register(name)}
      />

      {isPassword && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

Form.Submit = function Submit({ children, isLoading }) {
  return (
    <button type="submit" className="btn btn-primary w-full">
      {isLoading ? "Loading..." : children}
    </button>
  );
};
