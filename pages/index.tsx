import Head from "next/head";
import Link from "next/link";

import data from "../json/data.json";

export default function Home() {
  return (
    <>
      <Head>
        <title>Loopheads</title>
      </Head>
      <main>
        <h1 className="text-3xl font-bold mb-5 mt-3">Hello world!</h1>

        <ul>
          {data.data.map((d) => <li key={`Loophead-${d.name}`}><Link className="text-blue-500 hover:text-blue-700" href={`/${d.name}/0/0`}>Loophead #{d.name}</Link></li>)}
        </ul>
      </main>
    </>
  );
}
