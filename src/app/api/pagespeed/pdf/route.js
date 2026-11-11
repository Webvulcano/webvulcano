import { openToken } from "@/lib/pagespeed";
import { renderSummaryPdf } from "@/lib/pagespeedPdf";

// PageSpeed-összefoglaló PDF: a link a /api/pagespeed/reszletek által az Airtable-rekordba írt token.
// A PDF a tokenben titkosítva utazó mérési eredményből készül, nem tárolunk fájlt.
export async function GET(request) {
  const data = openToken(new URL(request.url).searchParams.get("t"));
  if (!data?.items || !data?.url || !data?.scores) {
    return new Response("Érvénytelen link.", { status: 404 });
  }
  try {
    const pdf = await renderSummaryPdf(data);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="pagespeed-osszefoglalo.pdf"',
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("PageSpeed PDF error:", err);
    return new Response("Nem sikerült elkészíteni a PDF-et.", { status: 500 });
  }
}
