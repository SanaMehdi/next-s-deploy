export default function HelpPage() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Help Center</h2>
      <div className="mb-4">
        <h3 className="font-bold">FAQ</h3>
        <ul className="list-disc pl-6">
          <li>How do I reset my password?</li>
          <li>How do I report abuse?</li>
          <li>How do I delete my account?</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Contact</h3>
        <p>Email: support@example.com</p>
      </div>
      <div>
        <h3 className="font-bold">Policies</h3>
        <ul className="list-disc pl-6">
          <li>Community Guidelines</li>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>
      </div>
    </div>
  );
}
