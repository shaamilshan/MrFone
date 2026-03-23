import React from 'react';

const stats = [
  { id: 1, name: 'Happy Customers', value: '1M+' },
  { id: 2, name: 'Premium Products', value: '10K+' },
  { id: 3, name: 'Brands Partnered', value: '50+' },
  { id: 4, name: 'Years of Experience', value: '15+' },
];

export default function StatsSection() {
  return (
    <div className="bg-slate-900 py-16 sm:py-24 my-12 rounded-[2rem] overflow-hidden relative shadow-2xl">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by tech enthusiasts worldwide
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            We've built our reputation by consistently delivering top-tier accessories and electronics to our community.
          </p>
        </div>
        
        <dl className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="flex flex-col items-center justify-center p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-slate-800/60"
            >
              <dd className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-200">
                {stat.value}
              </dd>
              <dt className="text-sm sm:text-base font-medium leading-6 text-slate-400 mt-3">
                {stat.name}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
