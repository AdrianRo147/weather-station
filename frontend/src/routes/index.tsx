import InternalError from '@/components/errors/internal-error';
import { TrendCard } from '@/components/trend-card';
import type { TrendCardProps } from '@/lib/definitions'
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  errorComponent: InternalError
})

/**
 * [                    TEMP GRAPH                           ]
 */
function RouteComponent() {
  const fetchCardData = async () => {
    const res = await Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/count`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/users/count`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/avg`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/avg/7`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/max`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/min`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/max/7`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/min/7`),
    ]);

    res.map((i) => {
      if (!i.ok) throw new Error();
    });

    const data = await Promise.all(res.map((i) => i.json()));

    return {
      recordsCount: String(data[0].count),
      usersCount: String(data[1].count),
      allTimeAvg: String(data[2].avg) + " °C",
      weekAvg: String(data[3].avg) + " °C",
      allTimeMax: String(data[4].max) + " °C",
      allTimeMin: String(data[5].min) + " °C",
      weekMax: String(data[6].max) + " °C",
      weekMin: String(data[7].min) + " °C"
    };
  };

  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["statsCards"],
    queryFn: () => fetchCardData()
  });

  if (isError) return <InternalError />;

  const trendCardsData: Array<Omit<TrendCardProps, "isLoading">> = [
    {
      title: "Total Records",
      value: data?.recordsCount || "-"
    },
    {
      title: "Total Users",
      value: data?.usersCount || "-"
    },
    {
      title: "Average Temperature (All-Time)",
      value: data?.allTimeAvg || "-"
    },
    {
      title: "Average Temperature (7 - Days)",
      value: data?.weekAvg || "-"
    },
    {
      title: "Max (All-Time)",
      value: data?.allTimeMax || "-"
    },
    {
      title: "Min (All-Time)",
      value: data?.allTimeMin || "-"
    },
    {
      title: "Max (7 - Days)",
      value: data?.weekMax || "-"
    },
    {
      title: "Min (7 - Days)",
      value: data?.weekMin || "-"
    }
  ];

  return (
    <>
      <div className="p-5 mb-5 rounded-xl bg-content1 font-bold text-2xl">
        <p className="font-bold text-2xl">Stats</p>
      </div>
      <div className="p-5 mb-5 rounded-xl bg-content1 font-bold text-2xl">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trendCardsData.map((props, index) => (
            <TrendCard key={index} isLoading={isLoading} {...props} />
          ))}
        </div>
      </div>
    </>
  )
}
