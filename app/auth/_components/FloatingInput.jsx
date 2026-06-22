'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Floating-label input with an optional leading icon and password visibility
 * toggle. Styled to match the dashboard's brand palette.
 */
export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  required = true,
  autoComplete,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4A6CFF] transition-colors z-10" />
      )}
      <input
        id={id}
        name={id}
        type={inputType}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full ${Icon ? 'pl-11' : 'pl-4'} pr-11 pt-6 pb-2 text-sm text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl appearance-none outline-none transition-all
          focus:border-[#4A6CFF] focus:ring-4 focus:ring-[#4A6CFF]/15 focus:bg-white hover:border-gray-300`}
      />
      <label
        htmlFor={id}
        className={`absolute ${Icon ? 'left-11' : 'left-4'} top-2 text-xs font-medium text-gray-400 transition-all pointer-events-none
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#4A6CFF]`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A6CFF] transition-colors z-10"
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
