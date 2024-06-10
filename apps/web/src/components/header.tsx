import { Feather } from 'lucide-react'

import { ProfileButton } from './profile-button'

export const Header = () => {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Feather className="size-6 text-emerald-500 dark:text-emerald-300" />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
