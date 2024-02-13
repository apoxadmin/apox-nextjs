import * as React from "react"

import { cn } from "@/lib/utils"
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputPassword = ({ className, type, showPassword, setShowPassword, value, onChange, ...props }: { className?: string, type?: string, showPassword?: boolean, setShowPassword?: any, value?: string, onChange?: any}) => {
  const [password, setPassword] = React.useState<string>("");  
  
  return (
      <div className="flex justify-between items-center h-10 w-full rounded-md border border-input px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <input
        type={type}
        className={cn(
          "min-w-0 flex-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value}
        onChange={onChange}
        {...props}
      />
      { showPassword ? <FaEyeSlash onClick={() => { setShowPassword(false) }}/> : <FaEye onClick={() => { setShowPassword(true) }}/>}
      </div>
    )
  }
InputPassword.displayName = "Input"

