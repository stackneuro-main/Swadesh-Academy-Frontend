import {
  branchAddresses,
  Other,

  softwareDevelopmentLinks,
} from "../utils/FooterData";

function FooterSection({ title, items }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="space-y-3 text-sm text-gray-400">
        {items.map((item, index) =>
          typeof item === "string" ? (
            <li key={index}>{item}</li>
          ) : (
            <li key={index}>
              <p className="font-medium">{item.city}</p>
              <p>{item.address}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-3 mb-0 min-h-[250px] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto grid md:justify-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FooterSection title="Branch Addresses" items={branchAddresses} />
       <FooterSection title="Software Development" items={softwareDevelopmentLinks} />
       <FooterSection title="Career Skills" items={Other} />
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Stackneuro. All rights reserved.
      </div>
    </footer>
  );
}
