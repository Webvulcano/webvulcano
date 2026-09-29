// Dőlt serif kiemelés a sans címsorokban (referencia: "win clients").
export default function Accent({ children, className = "" }) {
  return (
    <em className={`font-serif font-normal italic tracking-normal ${className}`}>
      {children}
    </em>
  );
}
