import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/components/projectlist'

export const metadata = {
  title: 'Projektek — webvulcano',
  description: 'Referenciák és elkészült projektek.',
}

export default function ProjektekPage() {
  return (
    <>
      <main className="section section-padded">
        <h1 className="t-meta c-dim mb-lg">Projektek — weboldal készítés Budapesten</h1>
        {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} last={i === projects.length - 1} compact />)}
      </main>
    </>
  )
}
