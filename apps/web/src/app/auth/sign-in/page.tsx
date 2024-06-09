import Image from 'next/image'
import Link from 'next/link'

import githubLogo from '@/assets/github.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithEmailAndPassword } from './actions'

const SignInPage = () => {
  return (
    <form action={signInWithEmailAndPassword} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />

        <Link
          className="text-sm text-muted-foreground"
          href="/auth/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full">
        Sign in with email
      </Button>
      <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>
      <Separator />
      <Button variant="outline" className="w-full">
        <Image
          src={githubLogo}
          alt="GitHub Logo"
          className="mr-2 size-4 dark:invert"
          width={32}
          height={32}
        />
        Sign in with GitHub
      </Button>
    </form>
  )
}

export default SignInPage
