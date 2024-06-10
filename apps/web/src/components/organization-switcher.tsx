import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { getOrganizations } from '@/http/get-organizations'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export const OrganizationSwitcher = async () => {
  const { organizations } = await getOrganizations()
  const currentOrg = cookies().get('org')?.value

  const currentOrganization = organizations.find(
    (organization) => organization.slug === currentOrg,
  )

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {currentOrganization ? (
            <>
              <Avatar className="mr-2 size-4">
                {currentOrganization.avatarUrl && (
                  <AvatarImage src={currentOrganization.avatarUrl} />
                )}
                <AvatarFallback className="bg-emerald-600 text-white" />
              </Avatar>
              <span className="truncate">{currentOrganization.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select organization</span>
          )}

          <ChevronsUpDown className="ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-16}
          sideOffset={12}
          className="w-[200px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.map((organization) => {
              return (
                <DropdownMenuItem key={organization.id} asChild>
                  <Link
                    className="cursor-pointer"
                    href={`/org/${organization.slug}`}
                  >
                    <Avatar className="mr-2 size-4">
                      {organization.avatarUrl && (
                        <AvatarImage src={organization.avatarUrl} />
                      )}
                      <AvatarFallback className="bg-emerald-600 text-white" />
                    </Avatar>
                    <span className="line-clamp-1">{organization.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/create-organization" className="cursor-pointer">
              <PlusCircle className="mr-2 size-4" />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
