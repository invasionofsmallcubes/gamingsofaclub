import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import GameCard from '../component/GameCard'
import { JsonProperty, JsonClassType, ObjectMapper } from 'jackson-js';

class BeatInfo {
  @JsonProperty() @JsonClassType({ type: () => [Number] })
  main: number
  @JsonProperty() @JsonClassType({ type: () => [Number] })
  mainExtra: number
  @JsonProperty() @JsonClassType({ type: () => [Number] })
  completionist: number
  constructor(main: number, mainExtra: number, completionist: number) {
    this.main = main
    this.mainExtra = mainExtra;
    this.completionist = completionist;
  }
}

class Game {
  @JsonProperty() @JsonClassType({ type: () => [Number] })
  rank: number
  @JsonProperty() @JsonClassType({ type: () => [String] })
  name: string
  @JsonProperty() @JsonClassType({ type: () => [String] })
  slug: string
  @JsonProperty() @JsonClassType({ type: () => [BeatInfo] })
  beatInfo: BeatInfo
  @JsonProperty() @JsonClassType({ type: () => [String] })
  imageUrl: string
  @JsonProperty() @JsonClassType({ type: () => [String] })
  summary: string
  constructor(rank: number, name: string,
    slug: string, beatInfo: BeatInfo,
    imageUrl: string, summary: string) {
    this.rank = rank
    this.name = name
    this.slug = slug
    this.beatInfo = beatInfo
    this.imageUrl = imageUrl
    this.summary = summary
  }
}
interface Props {
  games: Game[]
}

const Home: NextPage<Props> = (props: Props) => {
  const lista = props.games.map((g) => <li key={g.rank}><GameCard game={g} /></li>);

  return (
    <div className={styles.container}>
      <Head>
        <title>The Game Sofa Club</title>
        <meta name="description" content="The Game Sofa Club - home of the top 100 video games of all time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to The Game Sofa Club!
        </h1>

        <ul>{lista}</ul>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

import * as fs from 'fs'

function syncReadFile(filename: string) {
  const result = fs.readFileSync(filename, 'utf-8');
  return result;
}

export const getStaticProps: GetStaticProps = async (context) => {

  const content = syncReadFile('games.json')
  const games = new ObjectMapper().parse<Game[]>(content)

  return {
    props: { games },
  }
}


export default Home
