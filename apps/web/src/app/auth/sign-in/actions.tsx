'use server'

export const signInWithEmailAndPassword = async (data: FormData) => {
  console.log(Object.fromEntries(data))
  console.log(data)
}
