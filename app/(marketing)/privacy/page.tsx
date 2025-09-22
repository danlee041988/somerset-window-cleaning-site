import Section from '@/components/ui/Section'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-20">
      <Section
        title="Privacy Policy"
        subtitle="How Somerset Window Cleaning uses and protects your personal information."
      >
        <div className="prose prose-invert max-w-none text-white/80">
          <p>
            <strong>Last updated:</strong> 22 September 2025
          </p>

          <h2>1) Who we are</h2>
          <p>
            Somerset Window Cleaning (&quot;SWC&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides window and exterior cleaning services
            across Somerset. We are the data controller for the personal data we process about our customers,
            prospective customers, and website visitors.
          </p>
          <p>
            Contact for privacy matters: <strong>Privacy Lead</strong>,{' '}
            <a href="mailto:info@somersetwindowcleaning.co.uk">info@somersetwindowcleaning.co.uk</a>,{' '}
            <a href="tel:01458860339">01458 860 339</a>, 13 Rockhaven Business Centre, Gravenchon Way, Street, Somerset, BA16 0HW.
          </p>
          <p>
            If you are a commercial client and we work on your instruction (for example, as a subcontractor), we may act
            as your processor (in which case your privacy notice applies).
          </p>
          <p>
            We process personal data under the UK data protection framework, including the UK GDPR as amended, the Data
            Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR). Guidance on these laws
            is issued by the UK Information Commissioner&apos;s Office (ICO). Recent amendments are being implemented via the
            Data (Use and Access) Act 2025.
          </p>

          <h2>2) What data we collect</h2>
          <p>We only collect what we need to deliver our services:</p>
          <ul>
            <li>
              <strong>Identity &amp; contact:</strong> name, email, and phone number.
            </li>
            <li>
              <strong>Property &amp; access:</strong> service address, parking notes, safe-access instructions (for example,
              gate or side passage notes).
            </li>
            <li>
              <strong>Service &amp; communications:</strong> quotes, bookings (including via our online booking page), job
              notes, messages, and emails.
            </li>
            <li>
              <strong>Photos:</strong> optional before/after job photos for quotes, quality assurance, or proofs of work
              (see section 6).
            </li>
            <li>
              <strong>Payments &amp; transactions:</strong> invoice totals and payment confirmations. We do not store full
              card details; these are handled by our payment providers (GoCardless and Stripe).
            </li>
            <li>
              <strong>Website &amp; device:</strong> IP address, pages viewed, and cookie or analytics data (see section 7).
            </li>
            <li>
              <strong>Business contacts (B2B):</strong> company name, role or title, and work contact details.
            </li>
            <li>
              <strong>Special category data:</strong> we do not seek this. If you voluntarily tell us something health
              related to help us work safely (for example, shielding preferences), we will use it only with your consent
              and only for that purpose.
            </li>
          </ul>

          <h2>3) How we use your data &amp; legal bases</h2>
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Examples</th>
                <th>Legal basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quotes &amp; bookings</td>
                <td>Responding to enquiries, providing quotes, scheduling visits via our booking form.</td>
                <td>Contract or steps to enter a contract</td>
              </tr>
              <tr>
                <td>Carrying out services</td>
                <td>Attending site, recording job notes, quality assurance.</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Invoicing &amp; payments</td>
                <td>Issuing invoices, taking payments, processing refunds.</td>
                <td>Contract; legal obligation (tax/accounting)</td>
              </tr>
              <tr>
                <td>Customer service</td>
                <td>Handling messages, rescheduling, and complaints.</td>
                <td>Legitimate interests (running our business and helping customers)</td>
              </tr>
              <tr>
                <td>Reviews &amp; feedback</td>
                <td>One-off messages after a job asking for feedback or reviews.</td>
                <td>
                  Legitimate interests; for email/SMS we follow PECR soft opt-in rules and always offer an opt-out.
                </td>
              </tr>
              <tr>
                <td>Direct marketing</td>
                <td>Occasional emails or texts to existing customers about relevant services with a clear opt-out.</td>
                <td>
                  Legitimate interests under the PECR soft opt-in (for our own similar services only). You can opt out at
                  any time.
                </td>
              </tr>
              <tr>
                <td>Safety &amp; security</td>
                <td>Maintaining basic logs to protect our website and services.</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Legal, tax &amp; compliance</td>
                <td>Record-keeping and responding to lawful requests.</td>
                <td>Legal obligation</td>
              </tr>
            </tbody>
          </table>
          <p>We do not sell your personal data.</p>

          <h2>4) Where data comes from</h2>
          <ul>
            <li>Directly from you (enquiries, calls, emails, booking or quote forms, in person).</li>
            <li>From your organisation (if you are a site contact for a commercial job).</li>
            <li>From your device when you visit our website (cookies or analytics, see section 7).</li>
          </ul>

          <h2>5) Who we share data with</h2>
          <p>
            We use trusted service providers (processors) to run our business. They only process data under our
            instructions and must meet security and privacy standards. Typical categories include:
          </p>
          <ul>
            <li>Website hosting, booking or scheduling tools, email/SMS providers, invoicing or payment providers.</li>
            <li>Professional services such as accountants for financial records and insurers if a claim arises.</li>
          </ul>
          <p>Some providers may be located outside the UK. See section 8 on international transfers.</p>

          <h2>6) Photos and social media</h2>
          <p>
            We may take property photos for quoting, quality checks, or proof of work. We will not publish identifiable
            photos of your home (for example, house numbers or vehicle plates) for marketing unless we have your consent
            or we have suitably anonymised the image.
          </p>

          <h2>7) Cookies &amp; tracking technologies</h2>
          <p>
            We use necessary cookies to make the site work and, if enabled, optional analytics to help us improve the
            site. We ask for your consent for non-essential cookies where required, and you can change your choices at any
            time via our cookie banner or browser settings. UK cookie guidance is being updated following the Data (Use
            and Access) Act 2025 and we will adjust our approach as the ICO finalises its updated guidance.
          </p>
          <p>Examples:</p>
          <table>
            <thead>
              <tr>
                <th>Cookie/tool</th>
                <th>Purpose</th>
                <th>Type</th>
                <th>Typical expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>cmp_choice</td>
                <td>Stores your cookie preferences.</td>
                <td>Necessary</td>
                <td>Up to 6 months</td>
              </tr>
              <tr>
                <td>_ga, _gid (Google Analytics 4)</td>
                <td>Site measurement and improvement (only when you consent).</td>
                <td>Analytics (optional)</td>
                <td>Up to 2 years</td>
              </tr>
            </tbody>
          </table>
          <p>
            Managing cookies: you can withdraw consent via our cookie banner at any time or control cookies in your
            browser settings. The ICO provides practical guidance on managing cookies on its website.
          </p>

          <h2>8) International transfers</h2>
          <p>
            If any provider stores or accesses your data outside the UK, we use recognised safeguards such as the UK
            International Data Transfer Agreement (IDTA) or the UK Addendum to the EU Standard Contractual Clauses, or we
            rely on a UK adequacy decision where available. For transfers to eligible US organisations, we may use the UK-US
            Data Bridge (the UK extension to the EU-US Data Privacy Framework).
          </p>

          <h2>9) How long we keep data</h2>
          <p>
            We keep personal data only as long as needed for the purposes above, including to comply with law and to
            resolve disputes:
          </p>
          <ul>
            <li>Quotes and enquiries: generally 12-24 months after last contact (so we can pick up if you re-book).</li>
            <li>
              Customer and job records, invoices, and payments: typically 6 years from the end of the financial year to
              meet UK accounting or tax obligations and to defend legal claims (the Limitation Act sets six years for
              simple contracts).
            </li>
          </ul>
          <p>We then securely delete or anonymise data.</p>

          <h2>10) Your privacy rights</h2>
          <p>
            You have rights over your personal data, including access, rectification, erasure, restriction, portability,
            and the right to object to certain processing (for example, direct marketing). You can also withdraw consent
            where we rely on it. UK guidance on these rights is published by the ICO. To exercise any right, contact us
            using the details in section 1.
          </p>
          <p>
            If we cannot verify your identity or if an exemption applies (for example, protecting others&apos; data or
            fulfilling legal obligations), we will explain this to you.
          </p>

          <h2>11) Marketing preferences</h2>
          <p>
            For email or SMS marketing to existing customers, we follow PECR&apos;s soft opt-in rules and always include an
            unsubscribe link. You can opt out at any time, and we will continue to send essential service messages
            (appointments, invoices) regardless of marketing preferences.
          </p>

          <h2>12) Security</h2>
          <p>
            We use reasonable technical and organisational measures to protect your information, such as access controls,
            encrypted connections (HTTPS), staff need-to-know access, and reputable providers. No system is perfectly
            secure, but we work to reduce risks and review suppliers regularly.
          </p>

          <h2>13) Complaints</h2>
          <p>
            If you have concerns, please contact us first so we can help. You also have the right to complain to the
            Information Commissioner&apos;s Office (ICO) on 0303 123 1113 or via the ICO website.
          </p>

          <h2>14) Children</h2>
          <p>Our services and website are not aimed at children. We do not knowingly collect children&apos;s personal data.</p>

          <h2>15) Changes to this policy</h2>
          <p>
            We may update this notice to reflect changes in our services or the law (including ongoing ICO updates related
            to the Data (Use and Access) Act 2025). We will post the new version with a new &quot;Last updated&quot; date.
          </p>
        </div>
      </Section>
    </div>
  )
}
