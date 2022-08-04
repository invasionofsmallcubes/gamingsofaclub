import React from 'react'
import { NextPage } from 'next'
import Image from 'next/image'

type BeatInfo = {
    main: number
    mainExtra: number
    completionist: number
}

type Game = {
    rank: number
    name: string
    slug: string
    beatInfo?: BeatInfo
    imageUrl?: string
    summary?: string
}

interface Props {
    game: Game
}

const GameCard: NextPage<Props> = (props: Props) => {
    const { game } = props
    console.log(game.imageUrl)
    return <a href={"/game/" + game.slug} className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <Image width="100px" height="100px" className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={game.imageUrl!} alt={game.name} />
        <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">#{game.rank} {game.name}</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{game.summary}</p>
        </div>
    </a>
}

export default GameCard;
