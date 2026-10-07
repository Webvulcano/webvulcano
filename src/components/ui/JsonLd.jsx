// schema.org strukturált adat. A `<` escape-elése megakadályozza, hogy a tartalom lezárja a script taget.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
