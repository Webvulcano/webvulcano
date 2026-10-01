import StarRating from "@/components/ui/StarRating";

// Ügyfeleknek küldött értékelő link (nem publikus oldal): 4–5★ → Google, 1–3★ → privát visszajelzés.
export const metadata = {
  title: "Értékelés | Webvulcano",
  description: "Mondd el, mennyire voltál elégedett a munkával.",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x min-h-[80svh] pt-40 pb-24 lg:pt-48 lg:pb-36">
        <StarRating />
      </div>
    </main>
  );
}
