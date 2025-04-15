// src/components/Subscription.jsx
function Subscription({ formId }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed successfully!');
    e.target.reset();
  };

  return (
    <section className="subscription">
      <h3>Receive notifications when new features are launched</h3>
      <form id={formId} onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email here" aria-label="Email for subscription" required />
        <button type="submit" aria-label="Subscribe to notifications">SUBSCRIBE</button>
      </form>
    </section>
  );
}

export default Subscription;