import { type FormEvent, useState, useTransition } from 'react'

export type FormState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export const useFormState = (
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState,
) => {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<FormState>(
    initialState ?? { success: false, message: null, errors: null },
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const state = await action(data)

      if (state.success === true && onSuccess) {
        await onSuccess()
      }
      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
