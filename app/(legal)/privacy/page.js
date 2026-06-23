import LegalShell, { Section } from '../_components/LegalShell';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How NexPrep AI collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains how NexPrep AI (&quot;NexPrep&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses, and
        safeguards your information when you use our interview-preparation platform. By using NexPrep you agree to the
        practices described here.
      </p>

      <Section heading="Information we collect">
        <p>
          <strong>Account information:</strong> your name and email address when you sign up (via email/password or
          Google sign-in).
        </p>
        <p>
          <strong>Practice data:</strong> the interviews you generate, your answers, and the AI feedback and scores
          produced for you.
        </p>
        <p>
          <strong>Uploaded content:</strong> resume files you submit to the ATS checker, which are parsed to produce a
          score and are not shared with third parties.
        </p>
        <p>
          <strong>Technical data:</strong> basic usage and device information used to operate and improve the service.
        </p>
      </Section>

      <Section heading="How we use your information">
        <p>We use your information to provide and personalize the service: generating tailored interviews, evaluating
          your answers, tracking your progress, and supporting your account. We do not sell your personal data.</p>
      </Section>

      <Section heading="Third-party services">
        <p>
          We use <strong>Google Firebase</strong> for authentication, <strong>MongoDB</strong> for storing your practice
          data, and <strong>Google Gemini</strong> to generate interview questions and feedback. Your answers are sent to
          Gemini solely to produce your feedback. These providers process data under their own privacy terms.
        </p>
      </Section>

      <Section heading="Microphone and camera">
        <p>
          The interview experience can use your microphone (for speech-to-text) and camera (for a realistic preview).
          These run locally in your browser and require your explicit permission. Video is never recorded or uploaded.
        </p>
      </Section>

      <Section heading="Data retention and your rights">
        <p>
          We retain your account and practice data until you delete it. You can edit your profile, delete your interviews,
          or delete your account at any time from the settings page. To request a copy or full deletion of your data,
          contact us at the email below.
        </p>
      </Section>

      <Section heading="Security">
        <p>We use industry-standard measures to protect your data, including encrypted connections and access controls.
          No method of transmission is 100% secure, but we work to protect your information.</p>
      </Section>

      <Section heading="Contact">
        <p>Questions about this policy? Email us at <strong>insightfusionanalytics@gmail.com</strong>.</p>
      </Section>
    </LegalShell>
  );
}
