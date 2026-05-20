import Button from "../components/Button";
export default function About() {
  const aboutSections = [
    {
      title: "Who We Are",
      text: "We are an innovative educational institution and IT solutions provider dedicated to empowering students and businesses with quality learning and cutting-edge technology. Our goal is to simplify complex subjects and make knowledge accessible to everyone."
    },
    {
      title: "Our Mission",
      text: "To deliver high-quality education, skill development, and technology solutions that prepare students and professionals for the ever-changing future."
    },
    {
      title: "What We Offer",
      text: "From CBSE and Odisha Board coaching to advanced IT courses like AI, Web Development, and Full Stack, we also provide business services like branding, GST registration, and software development."
    },
    {
      title: "Why Choose Us?",
      text: "✔ Experienced Educators & Developers\n✔ Personalized Learning Approach\n✔ Real-world Project Experience\n✔ Affordable & Flexible Courses"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Learn more about our journey, mission, and the services we provide.
        </p>
      </div>

      {/* Sections */}
      <div className="grid gap-8 md:grid-cols-2">
        {aboutSections.map((section, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl shadow-md border border-gray-100 bg-white hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-3 text-blue-600">
              {section.title}
            </h2>
            {section.text.split("\n").map((line, i) => (
              <p key={i} className="text-gray-700 mb-2">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-700">
          Ready to start your journey with us?
        </p>
       <Button name="Contact Us" styleType="primary"  link= "/Contact"/>
      </div>
    </section>
  );
}

