import Section from '@/components/ui/Section'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Privacy Policy" subtitle="We only use your details to respond to your enquiry and deliver our services.">
        <div className="prose prose-invert max-w-none text-white/80">
          <p>This is a placeholder privacy policy. Replace with your actual policy before launch.</p>
          <p>Contact: <a href="mailto:info@somersetwindowcleaning.co.uk">info@somersetwindowcleaning.co.uk</a></p>
        </div>
      </Section>
    </div>
  )
}
