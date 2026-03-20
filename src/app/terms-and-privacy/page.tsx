import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy — Real Good Denver",
};

export default function TermsAndPrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none mt-24">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Effective Date: January 1, 2025</p>

          <div className="space-y-6 text-foreground">
            <p>Welcome to realgooddenver.com (&ldquo;Website,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or using our Website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Use of the Site</h2>
              <p>This Website is intended for individuals aged 13 and older. By using the Website, you represent that you are at least 13 years of age.</p>
              <p>You agree not to use the Website for any unlawful or prohibited activities.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Intellectual Property</h2>
              <p>All content on this Website, including text, images, logos, videos, and design, is owned by or licensed to Real Good Denver and is protected by intellectual property laws. You may not reproduce, republish, or distribute any content without our written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Submissions</h2>
              <p>If you submit any content (comments, stories, photos, etc.), you grant us a non-exclusive, royalty-free, worldwide license to use, publish, and display that content in any media.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Links</h2>
              <p>Our Website may contain links to third-party sites. We are not responsible for the content or practices of those websites and encourage you to review their terms and privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Disclaimers</h2>
              <p>We provide this Website &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no guarantees about the accuracy, completeness, or reliability of any content. Your use of the Website is at your own risk.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p>In no event shall Real Good Denver be liable for any damages arising from your use of the Website or its content.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Modifications</h2>
              <p>We may update these Terms from time to time. Continued use of the Website after changes means you accept the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p>If you have questions about these Terms, contact us at:</p>
              <p>Email: hello@realgooddenver.com</p>
            </section>
          </div>

          <h1 className="text-3xl font-bold mb-8 mt-16 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Effective Date: January 1, 2025</p>

          <div className="space-y-6 text-foreground">
            <p>We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit realgooddenver.com.</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p><strong>Personal Information:</strong> If you sign up for our newsletter or contact us, we may collect your name and email address.</p>
              <p><strong>Usage Data:</strong> We collect non-personal data like IP address, browser type, pages visited, and time spent on the site to improve user experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We may use your information to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Send newsletters or event updates</li>
                <li>Respond to inquiries</li>
                <li>Improve site performance and content</li>
                <li>Analyze user behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Sharing Your Information</h2>
              <p>We do not sell or rent your personal information. We may share it with third-party service providers who help us operate the Website (such as email delivery tools or analytics platforms), under confidentiality agreements.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p>We use cookies and similar technologies to enhance your experience. You can choose to disable cookies in your browser settings, though some features may not work properly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p>You can opt out of our emails at any time by clicking the unsubscribe link in any message. You may also request to access, correct, or delete your personal information by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
              <p>We may update this Privacy Policy periodically. We encourage you to review it regularly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p>For any privacy-related questions, reach out to:</p>
              <p>Email: hello@realgooddenver.com</p>
            </section>
          </div>
        </div>
      </div>
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
