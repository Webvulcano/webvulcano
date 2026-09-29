"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import GuideModal from "@/components/ui/GuideModal";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// „ChatGPT téged ajánl?” — a /api/ai-ajanlas route kérdezi az OpenAI-t webes kereséssel.

// Helyhatározó rag a gyakori városokra; ismeretlennél magánhangzó-illeszkedés.
const cityCase = {
  budapest: "Budapesten",
  pécs: "Pécsett",
  szeged: "Szegeden",
  miskolc: "Miskolcon",
  kecskemét: "Kecskeméten",
  székesfehérvár: "Székesfehérváron",
  nyíregyháza: "Nyíregyházán",
  szombathely: "Szombathelyen",
  zalaegerszeg: "Zalaegerszegen",
  kaposvár: "Kaposváron",
  tatabánya: "Tatabányán",
  szolnok: "Szolnokon",
  érd: "Érden",
  vác: "Vácon",
};

function inCity(city) {
  const known = cityCase[city.toLowerCase()];
  if (known) return known;
  const lastVowel = city.toLowerCase().match(/[aáeéiíoóöőuúüű](?=[^aáeéiíoóöőuúüű]*$)/)?.[0];
  return city + ("aáoóuú".includes(lastVowel ?? "e") ? "ban" : "ben");
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const input =
  "w-full rounded-full border border-paper/15 bg-paper/5 px-5 py-3 text-base text-paper placeholder:text-paper/40 focus:border-highlight/60 focus:outline-none";

export default function AiDemo() {
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("idle"); // idle | thinking | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    const x = industry.trim();
    const y = city.trim();
    if (!x || !y) return;
    // Azonnal kiírjuk a kérdést. Ismert városnál a helyi ragozás biztos jó; ismeretlennél
    // a modell ragozása (pl. „Pécsett”-típusú kivételekre) felülírja.
    const localQuestion = `Kit ajánlasz, ha ${x.toLowerCase()} kell ${inCity(cap(y))}?`;
    setResult({ question: localQuestion, items: [] });
    setState("thinking");

    try {
      const res = await fetch("/api/ai-ajanlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: x, city: y }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(res.status === 429 ? "Mára elfogytak a kérdéseid – próbáld holnap újra." : "Most nem sikerült elérni a ChatGPT-t. Próbáld újra kicsit később.");
        setState("error");
        return;
      }
      setResult({ question: (cityCase[y.toLowerCase()] ? localQuestion : data.question) || localQuestion, items: data.items });
      setState("done");
    } catch {
      setError("Most nem sikerült elérni a ChatGPT-t. Próbáld újra kicsit később.");
      setState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-paper/10 bg-night-2 p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] md:p-6">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-paper/60">
          Melyik iparágban dolgozol?
          <input
            className={input}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="pl. fodrász"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm text-paper/60">
          Melyik városban?
          <input
            className={input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="pl. Győr"
            required
          />
        </label>
        <button
          type="submit"
          disabled={state === "thinking"}
          className="glow-accent inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60 sm:col-span-2"
        >
          Kérdezzük meg a ChatGPT-t
          <Icon name="arrow" className="size-4" strokeWidth={2} />
        </button>
      </form>

      {result && (
        <div className="mt-6 border-t border-paper/10 pt-5" aria-live="polite">
          <p className="rise flex items-start gap-2 text-base font-medium text-paper">
            <Icon name="search" className="mt-1 size-4 shrink-0 text-highlight" strokeWidth={2} />
            „{result.question}”
          </p>

          {state === "thinking" ? (
            <p className="mt-4 animate-pulse text-sm text-paper/50">ChatGPT keres a weben… (10–15 mp)</p>
          ) : state === "error" ? (
            <p className="mt-4 text-sm text-danger">{error}</p>
          ) : result.items.length === 0 ? (
            <p className="mt-4 text-sm text-paper/60">Erre nem találtam ajánlható vállalkozást – próbáld más szakmával vagy várossal.</p>
          ) : (
            <>
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

              <div className="rise mt-5 flex flex-wrap items-center justify-between gap-4" style={{ "--d": "700ms" }}>
                <p className="text-base font-bold text-paper">
                  Nem vagy a listán? <span className="font-normal text-paper/70">Ezen tudunk változtatni.</span>
                </p>
                <Button href={site.ctaHref} size="sm">
                  {site.cta}
                </Button>
              </div>
              <GuideModal
                industry={industry}
                city={city}
                className="rise mt-5"
              />
              <p className="mt-4 text-sm text-paper/40">A választ a ChatGPT adta, élő webes kereséssel.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
