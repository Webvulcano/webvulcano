import StarRating from '@/components/StarRating'

export const metadata = {
  title: 'Értékelés — webvulcano',
  description: 'Mondd el, mennyire voltál elégedett a munkával.',
  robots: { index: false, follow: false },
}

export default function ErtekelesPage() {
  return (
    <main className="section section-padded" style={{ paddingTop: 'clamp(3rem,8vh,6rem)', paddingBottom: '4rem' }}>
      <StarRating />
    </main>
  )
}
