import PartnerProfile from "@/components/partnersPage/partnerProfile/PartnerProfile";

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9f8f6" }}>
      <PartnerProfile id={id} />
    </main>
  );
}
