import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader } from '@/components/ui/sheet'

import { OrganizationForm } from '../../create-organization/_components/organization-form'

export const CreateOrganization = () => {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>Create Organization</SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
export default CreateOrganization
