import React from 'react';

const Stats = ({ stats }) => {
  console.log('Stats data:', stats); // Debugging log

  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center lg:flex-row lg:items-center md:flex-row md:items-center stats">
      {stats?.map((stat) => (
        <div key={stat.label} className="flex flex-row items-center justify-start gap-2">
          <div className="flex items-center justify-center p-4 rounded-full bg-neutral-300">
            <stat.icon className="h-7 w-7 text-plum-1100" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-start">
            <div className="text-2xl font-bold leading-none tabular-nums">
              {stat.value}
            </div>
            <div className="font-xl medium text-muted-foreground">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
