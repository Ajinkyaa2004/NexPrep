import LegalShell, { Section } from '../_components/LegalShell';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms governing your use of NexPrep AI.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="June 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of NexPrep AI. By creating an account or
        using the service, you agree to these Terms.
      </p>

      <Section heading="Using NexPrep">
        <p>
          You must provide accurate account information and are responsible for activity under your account. You agree to
          use NexPrep only for lawful interview-preparation purposes and not to misuse, disrupt, or attempt to gain
          unauthorized access to the service.
        </p>
      </Section>

      <Section heading="AI-generated content">
        <p>
          NexPrep uses AI to generate interview questions, model answers, and feedback. This content is for practice and
          guidance only — it may contain inaccuracies and is not professional, legal, or career advice. Always apply your
          own judgement.
        </p>
      </Section>

      <Section heading="Your content">
        <p>
          You retain ownership of the resumes, answers, and other content you submit. You grant us a limited license to
          process that content solely to provide the service to you (for example, generating your feedback report).
        </p>
      </Section>

      <Section heading="Availability and changes">
        <p>
          NexPrep is offered on an &quot;as is&quot; basis during early access. We may add, change, or remove features, and
          we may introduce paid plans in the future with notice. We aim for high availability but do not guarantee
          uninterrupted service.
        </p>
      </Section>

      <Section heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, NexPrep is not liable for any indirect or consequential damages arising
          from your use of the service, including interview or hiring outcomes.
        </p>
      </Section>

      <Section heading="Termination">
        <p>You may stop using NexPrep and delete your account at any time. We may suspend accounts that violate these
          Terms.</p>
      </Section>

      <Section heading="Contact">
        <p>Questions about these Terms? Email us at <strong>insightfusionanalytics@gmail.com</strong>.</p>
      </Section>
    </LegalShell>
  );
}
