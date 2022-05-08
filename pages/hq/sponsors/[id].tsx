import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import AdminSponsorDetailScene from 'src/scenes/Admin/SponsorDetail'

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  return {
    props: {
      sponsorId: (context.params?.['id'] as string) ?? ''
    }
  }
}

type Props = {
    sponsorId: string
}

const AdminSponsorDetailPage: NextPage<Props> = ({ sponsorId }) => {
  return (
    <>
      <AdminSponsorDetailScene sponsorId={sponsorId} />
    </>
  )
}

export default AdminSponsorDetailPage
