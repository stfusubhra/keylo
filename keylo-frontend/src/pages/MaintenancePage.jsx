import { useState } from 'react';

export default function MaintenancePage() {
  const [selectedCategory, setSelectedCategory] = useState('plumbing');
  const [priority, setPriority] = useState('low');

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Left Column: Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-lg">
            <div className="flex flex-col gap-unit">
              <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface uppercase border-b-2 border-primary pb-sm inline-block w-fit mb-md font-bold">
                Something Broken?
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant" style={{ maxWidth: '672px' }}>
                Log an issue and our team will get it sorted. The more details you
                provide, the faster we can fix it.
              </p>
            </div>

            <form className="flex flex-col gap-xl">
              {/* Category Selection */}
              <div className="flex flex-col gap-md">
                <h3 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit">
                  1. Select Category
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-md">
                  {[
                    { value: 'plumbing', icon: 'water_drop', label: 'Plumbing' },
                    { value: 'electricity', icon: 'bolt', label: 'Electricity' },
                    { value: 'furniture', icon: 'chair', label: 'Furniture' },
                    { value: 'internet', icon: 'wifi', label: 'Internet' },
                  ].map((cat) => (
                    <label key={cat.value} className="cursor-pointer group relative">
                      <input
                        className="peer sr-only"
                        name="category"
                        type="radio"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={() => setSelectedCategory(cat.value)}
                      />
                      <div className="border-2 border-primary bg-surface p-md flex flex-col items-center justify-center gap-sm transition-all group-hover:-translate-y-1 peer-checked:bg-acid-lime peer-checked:translate-x-1 peer-checked:translate-y-1 peer-checked:shadow-none shadow-[4px_4px_0px_0px_#000000]">
                        <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                        <span className="font-label-caps text-label-caps text-center">{cat.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Issue Description */}
              <div className="flex flex-col gap-md">
                <h3 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit">
                  2. Describe the Issue
                </h3>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase" htmlFor="issue-title">
                    Short Title
                  </label>
                  <input
                    className="w-full bg-surface border-2 border-primary p-md font-body-lg text-body-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-acid-lime/50 transition-all"
                    id="issue-title"
                    placeholder="e.g. Leaking pipe under sink"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-sm mt-md">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase" htmlFor="issue-desc">
                    Details
                  </label>
                  <textarea
                    className="w-full bg-surface border-2 border-primary p-md font-body-lg text-body-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-acid-lime/50 transition-all resize-none"
                    id="issue-desc"
                    placeholder="Please describe exactly what happened and when..."
                    rows="4"
                  ></textarea>
                </div>
                <div className="mt-md border-2 border-primary border-dashed p-xl flex flex-col items-center justify-center gap-md bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">
                    add_photo_alternate
                  </span>
                  <div className="text-center">
                    <p className="font-label-caps text-label-caps text-primary uppercase">
                      Upload Photo / Video
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                      Drag & drop or click to browse
                    </p>
                  </div>
                  <input accept="image/*,video/*" className="hidden" multiple type="file" />
                </div>
              </div>

              {/* Priority Level */}
              <div className="flex flex-col gap-md">
                <h3 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit">
                  3. Priority Level
                </h3>
                <div className="flex gap-md">
                  {[
                    { value: 'low', label: 'Low', bg: 'bg-primary', text: 'text-on-primary' },
                    { value: 'med', label: 'Medium', bg: 'bg-[#FFD166]', text: 'text-primary' },
                    { value: 'urgent', label: 'Urgent', bg: 'bg-[#EF476F]', text: 'text-white', border: 'border-[#EF476F]' },
                  ].map((p) => (
                    <label key={p.value} className="cursor-pointer group flex-1">
                      <input
                        className="peer sr-only"
                        name="priority"
                        type="radio"
                        value={p.value}
                        checked={priority === p.value}
                        onChange={() => setPriority(p.value)}
                      />
                      <div className={`border-2 border-primary bg-surface p-sm flex items-center justify-center gap-sm transition-all peer-checked:${p.bg} peer-checked:${p.text} ${p.border ? `peer-checked:${p.border}` : ''}`}>
                        <span className="font-label-caps text-label-caps">{p.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-lg">
                <button
                  className="w-full md:w-auto px-[40px] py-lg bg-acid-lime border-2 border-primary font-h3 text-h3 uppercase hover:-translate-y-1 shadow-[8px_8px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-md"
                  type="button"
                >
                  Raise Request
                  <span className="material-symbols-outlined text-[32px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Active Tickets */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-xl">
            <div className="border-2 border-primary bg-surface-container-low p-lg shadow-[8px_8px_0px_0px_#000000]">
              <h3 className="font-h3 text-h3 text-on-surface uppercase border-b-2 border-primary pb-sm mb-lg">
                Active Tickets
              </h3>
              <div className="flex flex-col gap-lg">
                {/* Ticket 1 */}
                <div className="border-2 border-primary bg-surface p-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-acid-lime border-l-2 border-b-2 border-primary px-sm py-xs">
                    <span className="font-label-caps text-label-caps">REQ-4091</span>
                  </div>
                  <p className="font-label-caps text-label-caps text-[#EF476F] uppercase mb-xs">
                    Urgent • Plumbing
                  </p>
                  <h4 className="font-body-lg text-body-lg text-primary font-bold mb-md">
                    No hot water in master bath
                  </h4>
                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center gap-md">
                      <div className="w-4 h-4 bg-acid-lime border-2 border-primary rounded-full relative z-10"></div>
                      <p className="font-label-caps text-label-caps text-primary">Submitted</p>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-4 h-4 bg-acid-lime border-2 border-primary rounded-full relative z-10"></div>
                      <p className="font-label-caps text-label-caps text-primary">Notified</p>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-4 h-4 bg-surface-container-highest border-2 border-primary rounded-full relative z-10"></div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant">Assigned</p>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-4 h-4 bg-surface-container-highest border-2 border-primary rounded-full relative z-10"></div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant">Resolved</p>
                    </div>
                    <div className="absolute left-[23px] top-[100px] bottom-[30px] w-[2px] bg-primary z-0"></div>
                  </div>
                </div>

                {/* Ticket 2 */}
                <div className="border-2 border-primary bg-surface p-md relative opacity-75">
                  <div className="absolute top-0 right-0 bg-primary text-on-primary border-l-2 border-b-2 border-primary px-sm py-xs">
                    <span className="font-label-caps text-label-caps">REQ-3820</span>
                  </div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">
                    Low • Furniture
                  </p>
                  <h4 className="font-body-lg text-body-lg text-primary font-bold mb-md">
                    Loose hinge on wardrobe
                  </h4>
                  <p className="font-label-caps text-label-caps text-electric-purple bg-electric-purple/10 w-fit px-sm py-xs border-2 border-electric-purple">
                    Resolved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}