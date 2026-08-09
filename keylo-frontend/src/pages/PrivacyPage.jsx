export default function PrivacyPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="max-w-3xl mx-auto">
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Legal</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold mb-lg">Privacy Policy</h1>
        <div className="border-2 border-primary bg-surface-container-lowest p-lg shadow-[8px_8px_0px_0px_#000000] flex flex-col gap-lg font-body-md text-body-md text-on-surface-variant">
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">What KeyLo collects</h2>
            <p>KeyLo collects the information you provide when you create an account or book a stay: name, email, phone number, and the details of your rental agreements. Booking, deposit, and dispute records are stored so KeyLo can protect deposits and support dispute resolution.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">How your information is used</h2>
            <p>Your information is used to operate your account, process test-mode bookings, hold deposits in the KeyLo Vault, and communicate with you and your landlord about your stay. We do not sell your personal data.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">What we do not collect</h2>
            <p>KeyLo does not collect or store real payment card details. All payments in this demo run in test mode and no real money is charged.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">Your choices</h2>
            <p>You can update your profile, message your landlord, and close your account at any time. Contact KeyLo support for help with your data.</p>
          </section>
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-sm">Contact</h2>
            <p>Questions about this policy can be sent through the Support page or from your dashboard messages.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
