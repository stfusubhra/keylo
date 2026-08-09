export default function TermsPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="max-w-3xl mx-auto">
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Legal</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold mb-lg">Terms of Service</h1>
        <div className="border-2 border-primary bg-surface-container-lowest p-lg shadow-[8px_8px_0px_0px_#000000] flex flex-col gap-lg font-body-md text-body-md text-on-surface-variant">
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">1. Demo service</h2>
            <p>KeyLo is a student-rental prototype. Bookings, payments, and deposit protection run in test mode: no real payment is processed and no money is held on your behalf in a live sense.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">2. Booking fee</h2>
            <p>Each student&apos;s first KeyLo booking includes a one-time ₹997 fee covering background checks and contract generation. Landlords are charged a 5% success fee on collected rent. There are no subscription plans.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">3. KeyLo Vault</h2>
            <p>Security deposits are held by KeyLo rather than directly by the landlord. At checkout, deposits are released after an AI-assisted condition check, or moved into dispute resolution.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">4. Your responsibilities</h2>
            <p>You agree to provide accurate information, keep your login secure, and treat other users respectfully. Do not misuse the platform or attempt to bypass its safety checks.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">5. Changes</h2>
            <p>KeyLo may update these terms as the prototype evolves. Continued use of the service means you accept the updated terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
