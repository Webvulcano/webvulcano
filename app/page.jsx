import Hero from '@/components/Hero'
import Story from '@/components/Story'
import Works from '@/components/Works'
import QualificationForm from '@/components/QualificationForm'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <Hero />
        <Story />
        <Works />
        <QualificationForm />
      </main>
      <Footer />
    </>
  )
}
