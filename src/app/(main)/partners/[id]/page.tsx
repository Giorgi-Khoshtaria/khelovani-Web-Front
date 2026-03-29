import PartnerProfile from "@/components/partnersPage/partnerProfile/PartnerProfile";

async function getPartnerData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partner/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed SSR to fetch partner", error);
    return null;
  }
}

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialData = await getPartnerData(id);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9f8f6" }}>
      <PartnerProfile id={id} initialData={initialData} />
    </main>
  );
}
