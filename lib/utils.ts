import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ZodError {
  name: 'ZodError'
  message: string
  errors: Record<string, { message: string; path: string[] }>
}

export interface ValidationError {
  name: 'ValidationError'
  message: string
  errors: Record<string, { message: string }>
}

export type CustomError = ZodError | ValidationError | Error

export const formatError = (error: CustomError): string => {
  if (error.name === 'ZodError') {
    const zodError = error as ZodError
    const fieldErrors = Object.keys(zodError.errors).map((field) => {
      const errorMessage = zodError.errors[field].message
      return `${zodError.errors[field].path}: ${errorMessage}`
    })
    return fieldErrors.join('. ')
  } else if (error.name === 'ValidationError') {
    const validationError = error as ValidationError
    const fieldErrors = Object.keys(validationError.errors).map((field) => {
      const errorMessage = validationError.errors[field].message
      return errorMessage
    })
    return fieldErrors.join('. ')
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message)
  }
}