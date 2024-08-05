import React from "react";

function StatCard({exitData}) {
  console.log("exitData ins tats", exitData);
  const statsData = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/61c884a17c115f5d069fe84299fe04c00dac4a65480ed1607bb0c36a4076fec0?apiKey=8843d3a010584163b752e26820feff04&&apiKey=8843d3a010584163b752e26820feff04",
      title: "Total Exits",
      value: exitData?.results.total_exit,
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/76da00fdf354ec6a3b46192dcf469f56f5582712c3c7e590c7f62f3d3b59da5d?apiKey=8843d3a010584163b752e26820feff04&&apiKey=8843d3a010584163b752e26820feff04",
      title: "Accepted",
      value: exitData?.results.approved_resignation,
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a832169c18f8a59222ffafc6ea34b9a9855fb94bb3c58ff97d2ddf6ad1e57fec?apiKey=8843d3a010584163b752e26820feff04&&apiKey=8843d3a010584163b752e26820feff04",
      title: "Rejected",
      value: exitData?.results.rejected_resignation,
    },
  ];
   return (
     <section className="flex  gap-4 justify-center pr-10 pl-5 min-h-[113px] max-md:pr-5">
       {statsData.map((stat, index) => (
         <div className="flex overflow-hidden gap-5 items-center p-4 h-full bg-gray-50 rounded-xl min-w-[240px] w-[411px]" key={index}>
           <div className="flex gap-2.5 items-center self-stretch p-4 my-auto rounded-2xl bg-sky-500 bg-opacity-10 h-[72px] w-[72px]">
             <img
               loading="lazy"
               src={stat.icon}
               className="object-contain self-stretch my-auto w-10 aspect-square"
               alt={`${stat.title} icon`}
             />
           </div>
           <div className="flex flex-col justify-center items-start self-stretch my-auto text-center whitespace-nowrap">
             <div className="text-sm text-zinc-600">{stat.title}</div>
             <div className="mt-2 text-2xl text-zinc-800">{stat.value}</div>
           </div>
         </div>
       ))}
     </section>
   );
}

export default StatCard;
