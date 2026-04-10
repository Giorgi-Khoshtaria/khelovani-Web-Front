import PartnerProfile from "@/components/partnersPage/partnerProfile/PartnerProfile";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";

export const dynamic = "force-dynamic";

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await getPartnerById(id).catch(() => null);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9f8f6" }}>
      <PartnerProfile id={id} initialData={initialData} />
    </main>
  );
}
