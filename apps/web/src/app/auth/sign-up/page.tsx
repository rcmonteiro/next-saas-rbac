import Image from 'next/image'
import Link from 'next/link'

import githubLogo from '@/assets/github.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const SignUpPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="name" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input id="password_confirmation" type="password" />
      </div>
      <Button type="submit" className="w-full">
        Create account
      </Button>
      <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
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
        Sign up with GitHub
      </Button>
    </form>
  )
}

export default SignUpPage
