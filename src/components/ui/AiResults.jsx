import GuideModal from "@/components/ui/GuideModal";

// Chat-nézetben ennyivel a 3 cég után jön az útmutató (előbb olvassa el a listát).
const GUIDE_DELAY = 1500;

// Az AI-teszt válasza: a dobozban („box”) és a teljes képernyős ChatGPT-nézetben („chat”) is ez fut.
export default function AiResults({ result, state, error, industry, city, variant = "box" }) {
  const chat = variant === "chat";

  if (state === "thinking") {
    return chat ? (
      <div className="flex items-center gap-3 text-paper/60">
        <span className="flex gap-1.5">
          {[0, 150, 300].map((d) => (
            <span key={d} className="typing-dot size-2 rounded-full bg-paper/70" style={{ "--d": `${d}ms` }} />
          ))}
        </span>
        <span className="animate-pulse text-base">Keresés a weben…</span>
      </div>
    ) : (
      <p className="mt-4 animate-pulse text-sm text-paper/50">ChatGPT keres a weben… (10–15 mp)</p>
    );
  }

  if (state === "error") return <p className={`${chat ? "" : "mt-4"} text-sm text-danger`}>{error}</p>;

  if (result.items.length === 0) {
    return (
      <p className={`${chat ? "text-base" : "mt-4 text-sm"} text-paper/60`}>
        Erre nem találtam ajánlható vállalkozást – próbáld más szakmával vagy várossal.
      </p>
    );
  }

  return (
    <>
      {chat && (
        <p className="rise text-base text-paper/90 md:text-lg">
          Íme {result.items.length} vállalkozás, akit ajánlani tudok:
        </p>
      )}
      <ol className="mt-4 space-y-2.5">
        {result.items.map((it, i) => (
          <li
            key={it.name}
            className="rise flex items-center justify-between gap-3 rounded-xl bg-paper/5 px-4 py-3"
            style={{ "--d": `${i * 180}ms` }}
          >
            <span className="min-w-0">
              <span className="block text-base text-paper/90">
                <span className="mr-2 text-paper/40">{i + 1}.</span>
                {it.name}
              </span>
              {it.reason && <span className="mt-0.5 block text-sm text-paper/50">{it.reason}</span>}
            </span>
            {it.rating != null && (
              <span className="shrink-0 text-sm text-paper/60">
                <span className="text-highlight">★</span> {String(it.rating).replace(".", ",")}
                {it.reviews != null && ` (${it.reviews})`}
              </span>
            )}
          </li>
        ))}
      </ol>

      {chat && (
        <p className="rise mt-8 text-base font-bold text-paper md:text-lg" style={{ "--d": `${GUIDE_DELAY}ms` }}>
          Nem találod magad? <span className="font-normal text-paper/70">Akkor itt az útmutató:</span>
        </p>
      )}
      {chat ? (
        <div className="rise mt-4" style={{ "--d": `${GUIDE_DELAY + 250}ms` }}>
          <GuideModal industry={industry} city={city} />
        </div>
      ) : (
        <GuideModal industry={industry} city={city} className="rise mt-5" />
      )}
      <p
        className={`${chat ? "rise" : ""} mt-4 text-sm text-paper/40`}
        style={chat ? { "--d": `${GUIDE_DELAY + 500}ms` } : undefined}
      >
        A választ a ChatGPT adta, élő webes kereséssel.
      </p>
    </>
  );
}
