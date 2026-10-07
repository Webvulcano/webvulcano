import StarRating from '@/components/StarRating'
import styles from './page.module.css'

export const metadata = {
  title: 'Értékelés — webvulcano',
  description: 'Mondd el, mennyire voltál elégedett a munkával.',
  robots: { index: false, follow: false },
}

export default function ErtekelesPage() {
  return (
    <main className={`section ${styles.main}`}>
      <StarRating />
    </main>
  )
}
