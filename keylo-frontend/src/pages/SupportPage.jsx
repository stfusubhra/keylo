import { Link } from 'react-router-dom';

const supportTopics = [
  {
    icon: 'key',
    title: 'Account & sign-in',
    body: 'Reset your password from the sign-in page, or message KeyLo support from your dashboard once signed in.',
  },
  {
    icon: 'calendar_today',
    title: 'Bookings & move-in',
    body: 'Bookings are created in test mode. Your booking reference appears on the confirmation screen and in your dashboard.',
  },
  {
    icon: 'shield',
    title: 'Deposits & the Vault',
    body: 'Deposits are held by KeyLo, not the landlord. Raise a dispute from your dashboard when you disagree with a deposit outcome.',
  },
  {
    icon: 'build',
    title: 'Maintenance',
    body: 'Log an issue from the Maintenance page. It is attached to your booking so the property team has full context.',
  },
];

export default function SupportPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="max-w-4xl mx-auto">
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Help centre</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold mb-lg">How can we help?</h1>
        <div className="border-2 border-primary bg-surface-container-lowest p-lg shadow-[8px_8px_0px_0px_#000000] mb-lg">
          <h2 className="font-h3 text-h3 text-primary mb-sm">Contact KeyLo support</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            The fastest way to reach us is from your dashboard: open <span className="text-primary font-bold">Messages</span> and
            send a note attached to your booking. We reply from the same thread so everything stays on record.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link to="/dashboard/messages" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
              Open dashboard messages
            </Link>
            <Link to="/login" className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-surface-container-lowest hover:text-primary transition-all">
              Sign in
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {supportTopics.map((topic) => (
            <div key={topic.title} className="border-2 border-primary bg-surface-container-lowest p-lg">
              <span className="material-symbols-outlined text-[32px] text-primary">{topic.icon}</span>
              <h2 className="font-h3 text-h3 text-primary my-sm">{topic.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{topic.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
