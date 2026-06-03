import {
  branchAddresses,
  Other,
  softwareDevelopmentLinks,
} from "../utils/FooterData";

function FooterSection({ title, items }) {
  return (
    <div>
      <h3 className="mb-4 font-heading text-lg font-bold text-white">{title}</h3>
      <ul className="space-y-3 text-sm leading-6 text-slate-400">
        {items.map((item, index) =>
          typeof item === "string" ? (
            <li key={`${title}-${index}`}>{item}</li>
          ) : (
            <li key={`${title}-${item.city}`}>
              <p className="font-semibold text-slate-200">{item.city}</p>
              <p>{item.address}</p>
              {item.phones?.length ? (
                <div className="mt-3">
                  <p className="font-semibold text-slate-200">Phone:</p>
                  <div className="mt-1 grid gap-1">
                    {item.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="w-fit transition hover:text-blue-200"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-14 overflow-hidden border-t border-white/10 bg-slate-950 px-3 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_20%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
              Swadesh Academy
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white">
              A smarter and more premium learning experience.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Built to help students discover courses faster, trust the brand more, and move through the enrollment flow with clarity.
            </p>
          </div>

          <FooterSection title="Branch Address" items={branchAddresses} />
          <FooterSection title="Software Development" items={softwareDevelopmentLinks} />
          <FooterSection title="Career Skills" items={Other} />
        </div>

        <div className="mt-8 flex flex-col gap-2 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} ©Swadesh Academy. All rights reserved.</p>
          <p>designed and developed by team Stackneuro</p>
        </div>
      </div>
    </footer>
  );
}
