const StatementSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#111]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Images */}
        <div className="relative order-2 md:order-1">
          <img
            src="/hero/7.jpg"
            alt="Denver State Capitol aerial"
            className="w-full aspect-[3/4] object-cover rounded-3xl"
          />
          <img
            src="https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=600&auto=format&fit=crop&q=85"
            alt="Denver skyline"
            className="absolute -bottom-6 -right-4 md:-right-8 w-2/5 aspect-square object-cover rounded-2xl border-4 border-[#111] shadow-2xl rotate-2 hover:rotate-1 transition-transform duration-500"
          />
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-5 h-0.5 bg-blue-500 rounded" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400">Why this exists</p>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-[52px] font-black leading-[1.02] tracking-tight text-white mb-6">
            Denver deserves<br />
            <em className="font-light italic text-white/35">better coverage</em><br />
            than it gets.
          </h2>

          <p className="text-base text-white/50 leading-relaxed mb-10">
            National media shows up when there&apos;s a blizzard or a Broncos controversy. We&apos;re here the other 362 days. Covering the restaurant that just opened on Colfax, the city council vote that affects your rent, and the hike that&apos;s worth driving an hour for.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-4xl font-black tracking-tight text-white leading-none">
                37<span className="text-blue-500">K</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Weekly readers</p>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tight text-white leading-none">
                52<span className="text-blue-500">+</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Issues shipped</p>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tight text-white leading-none">
                $<span className="text-blue-500">0</span>
              </p>
              <p className="text-xs text-white/40 mt-1">To subscribe</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatementSection;
