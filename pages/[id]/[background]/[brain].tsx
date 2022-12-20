import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ButtonGroupLink from "../../../components/ButtonGroupLink";
import data from "../../../json/data.json";

type Props = {
  head: typeof data.data[number];
  brain: number
  background: number
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
  const backgroundNumber = Number(background)
  const brainNumber = Number(brain)

  if (!head || backgroundNumber < 0 || backgroundNumber > 4 || brainNumber < 0 || brainNumber > 4) {
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

const IPFS_URL = "https://cloudflare-ipfs.com/ipfs/";

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

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

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
      </Head>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3 mt-3">{title}</h1>
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
            blurDataURL={rgbDataURL(237, 181, 6)}
          />
        ) : (
          "?"
        )}

        <div className="text-lg font-bold mb-2 mt-3">Background</div>

        <div className="inline-flex rounded-md shadow-sm">
            <ButtonGroupLink active={background === 0} href={`/${head.name}/0/${brain}`} left>0</ButtonGroupLink>
            <ButtonGroupLink active={background === 1} href={`/${head.name}/1/${brain}`}>1</ButtonGroupLink>
            <ButtonGroupLink active={background === 2} href={`/${head.name}/2/${brain}`}>2</ButtonGroupLink>
            <ButtonGroupLink active={background === 3} href={`/${head.name}/3/${brain}`}>3</ButtonGroupLink>
            <ButtonGroupLink active={background === 4} href={`/${head.name}/4/${brain}`} right>4</ButtonGroupLink>
        </div>

        <div className="text-lg font-bold mb-2 mt-3">Brain</div>

        <div className="inline-flex rounded-md shadow-sm" role="group">
            <ButtonGroupLink active={brain === 0} href={`/${head.name}/${background}/0`} left>0</ButtonGroupLink>
            <ButtonGroupLink active={brain === 1} href={`/${head.name}/${background}/1`}>1</ButtonGroupLink>
            <ButtonGroupLink active={brain === 2} href={`/${head.name}/${background}/2`}>2</ButtonGroupLink>
            <ButtonGroupLink active={brain === 3} href={`/${head.name}/${background}/3`}>3</ButtonGroupLink>
            <ButtonGroupLink active={brain === 4} href={`/${head.name}/${background}/4`} right>4</ButtonGroupLink>
        </div>

        <div className="text-lg font-bold mb-2 mt-3">Image URL</div>

        <div className="mt-3">
          <a href={url || ''} className="text-blue-500 hover:text-blue-700">
            {url}
          </a>
        </div>
      </div>
    </>
  );
};

export default Loophead;
