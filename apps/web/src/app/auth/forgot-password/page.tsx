import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ForgotPasswordPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <Button type="submit" className="w-full">
        Recover password
      </Button>
      <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-in">Back to sign-in</Link>
      </Button>
    </form>
  )
}

export default ForgotPasswordPage
