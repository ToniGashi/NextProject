import Form from './components/Form';
import Header from './components/Header';

export default async function ReservePage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { date: string; time: string; partySize: string };
}) {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        {/* @ts-expect-error Server Component */}
        <Header
          slug={params.slug}
          date={searchParams.date.split('T')[0]}
          time={searchParams.date.split('T')[1]}
          partySize={searchParams.partySize}
        />
        <Form
          date={searchParams.date.split('T')[0]}
          time={searchParams.date.split('T')[1]}
          partySize={searchParams.partySize}
        />
      </div>
    </div>
  );
}
