import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import GameCard from '../components/GameCard'
import { ObjectMapper } from 'jackson-js';
import { Game } from "../domain/Game"
interface Props {
  games: Game[]
}

const Home: NextPage<Props> = (props: Props) => {
  const lista = props.games.map((g) => <GameCard key={g.rank} game={g} />);

  return (
    <div>
      <Head>
        <title>The Game Sofa Club</title>
        <meta name="description" content="The Game Sofa Club - home of the top 100 video games of all time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section>
          <div className='p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
            {lista}
          </div>
        </section>
      </main>

      <footer>
        Footer
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
