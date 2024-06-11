import { OrganizationForm } from './_components/organization-form'

export const CreateOrganizationPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Organization</h1>

      <div className="mx-auto max-w-2xl py-8">
        <OrganizationForm />
      </div>
    </div>
  )
}
export default CreateOrganizationPage
