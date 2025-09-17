import Section from '@/components/Section'
import LightboxGallery from '@/components/LightboxGallery'
import { GALLERY_IMAGES } from '@/content/image-manifest'

export const metadata = { title: 'Gallery' }

export default function GalleryPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Gallery" subtitle="A selection of recent jobs across Somerset.">
        <LightboxGallery images={GALLERY_IMAGES} />
      </Section>
    </div>
  )
}
