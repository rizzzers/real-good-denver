const PullQuote = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#111]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/80 leading-relaxed mb-8">
          Denver is more than its clichés. We go past the dispensary and the dog park to find the legends, the operators, the festivals, the hangovers, and everything worth knowing about this city.{" "}
          <strong className="text-white">Politics stay out. Good stuff stays in.</strong>
        </p>
        <div className="flex items-center justify-center gap-3">
          <img
            src="/ryan-estes.png"
            alt="Ryan Estes"
            className="w-10 h-10 rounded-full object-cover"
          />
          <cite className="not-italic text-sm text-white/40 font-medium">
            Ryan Estes · Founder, Real Good Denver
          </cite>
        </div>
      </div>
    </section>
  );
};

export default PullQuote;
