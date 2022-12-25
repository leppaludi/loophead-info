import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ButtonGroupLink from "../../../components/ButtonGroupLink";
import data from "../../../json/data.json";

type Props = {
  head: typeof data.data[number];
  brain: number;
  background: number;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  {
    id: string;
    brain: string;
    background: string;
  }
> = async (context) => {
  const { id, brain, background } = context.params!;

  const head = data.data.find((v) => v.name === id);
  const backgroundNumber = Number(background);
  const brainNumber = Number(brain);

  if (
    !head ||
    backgroundNumber < 0 ||
    backgroundNumber > 4 ||
    brainNumber < 0 ||
    brainNumber > 4
  ) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      head,
      brain: brainNumber,
      background: backgroundNumber,
    },
  };
};

// const IPFS_URL = "https://cloudflare-ipfs.com/ipfs/";
const IPFS_URL = "https://loopring.mypinata.cloud/ipfs/";

const ipfsImageToUrl = (img: string, background: number, brain: number) => {
  const regex =
    /ipfs:\/\/([\w]+)\/(loophead[0-9]+_[0-9]+)_([0-4])_([0-4])\.png/g;
  let m;
  while ((m = regex.exec(img)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    return `${IPFS_URL}${m[1]}/${m[2]}_${background}_${brain}.png`;
  }

  return null;
};

const rgbDataURL = `data:image/gif;base64,R0lGODlhAQABAPAAAO21Bv///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

const Loophead = ({
  head,
  brain,
  background,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const title = `Loophead #${head.name}`;
  const url = useMemo(
    () => ipfsImageToUrl(head.image, background, brain),
    [background, brain, head.image]
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:url" content="https://lh.lepp.io" />
        <meta property="og:title" content={title} />
        {url && <meta property="og:image" content={url} />}
        <meta property="og:site_name" content="Loopheads" />
      </Head>
      <div className="text-center">
        <h1 className="mt-3 mb-3 text-3xl font-bold">{title}</h1>
        <div className="mb-3">
          <Link className="text-blue-500 hover:text-blue-700" href={`/`}>
            Go back
          </Link>
        </div>
        {url ? (
          <Image
            className="mx-auto"
            src={url}
            alt={title}
            width={500}
            height={500}
            unoptimized
            placeholder="blur"
            blurDataURL={rgbDataURL}
          />
        ) : (
          "?"
        )}

        <div className="mt-3 mb-2 text-lg font-bold">Background</div>

        <div className="inline-flex rounded-md shadow-sm">
          <ButtonGroupLink
            active={background === 0}
            href={`/${head.name}/0/${brain}`}
            position="left"
          >
            0
          </ButtonGroupLink>
          <ButtonGroupLink
            active={background === 1}
            href={`/${head.name}/1/${brain}`}
          >
            1
          </ButtonGroupLink>
          <ButtonGroupLink
            active={background === 2}
            href={`/${head.name}/2/${brain}`}
          >
            2
          </ButtonGroupLink>
          <ButtonGroupLink
            active={background === 3}
            href={`/${head.name}/3/${brain}`}
          >
            3
          </ButtonGroupLink>
          <ButtonGroupLink
            active={background === 4}
            href={`/${head.name}/4/${brain}`}
            position="right"
          >
            4
          </ButtonGroupLink>
        </div>

        <div className="mt-3 mb-2 text-lg font-bold">Brain</div>

        <div className="inline-flex rounded-md shadow-sm" role="group">
          <ButtonGroupLink
            active={brain === 0}
            href={`/${head.name}/${background}/0`}
            position="left"
          >
            0
          </ButtonGroupLink>
          <ButtonGroupLink
            active={brain === 1}
            href={`/${head.name}/${background}/1`}
          >
            1
          </ButtonGroupLink>
          <ButtonGroupLink
            active={brain === 2}
            href={`/${head.name}/${background}/2`}
          >
            2
          </ButtonGroupLink>
          <ButtonGroupLink
            active={brain === 3}
            href={`/${head.name}/${background}/3`}
          >
            3
          </ButtonGroupLink>
          <ButtonGroupLink
            active={brain === 4}
            href={`/${head.name}/${background}/4`}
            position="right"
          >
            4
          </ButtonGroupLink>
        </div>

        <div className="mt-3 mb-2 text-lg font-bold">Image URL</div>

        <div className="mt-3">
          <a href={url || ""} className="text-blue-500 hover:text-blue-700">
            {url}
          </a>
        </div>
      </div>
    </>
  );
};

export default Loophead;
