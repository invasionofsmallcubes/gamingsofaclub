import React from 'react'
import { NextPage } from 'next'
import styles from "../styles/GameCard.module.css";

type BeatInfo = {
    main: number
    mainExtra: number
    completionist: number
}

type Game = {
    rank: number
    name: string
    slug: string
    beatInfo: BeatInfo
    imageUrl: string
    summary: string
}

interface Props {
    game: Game
}

const GameCard: NextPage<Props> = (props: Props) => {
    const { game } = props
    // return <div className="flex ">
    //     <img className="flex-none w-14" src={game.imageUrl} alt="" />
    //     <div className="flex-initial w-64">
    //         <h5 className="">{game.name}</h5>
    //         <p className="">{game.summary!}</p>
    //     </div>
    // </div>
    return <div className={styles.main}>
        <div className={styles.below}>
            <div className={styles.title}>#{game.rank}</div>
        </div>
        <img className={styles.image} src={game.imageUrl} alt={game.slug} />
        <div className={styles.below}>
            <div className={styles.title}>{game.name}</div>
            <p className={styles.summary}>
                {game.summary}
            </p>
        </div>
        <div className={styles.hltbMain}>
            <div className={styles.htlbBg}>
                <img className={styles.hltbImage} src="/hltb_brand.png" alt="HLTB Logo" />
            </div>
            <div className={styles.hltbMain}>
                <p className={styles.hltbTitle}>HowLongToBeat™ Data:</p>
                <p className={styles.hltbData}>Main: {game.beatInfo.main} hours, Extra: {game.beatInfo.mainExtra} hours, Completionist: {game.beatInfo.completionist} hours</p>
            </div>
        </div>
        <div className={styles.tags}>
            <span className={styles.tag}>#photography</span>
            <span className={styles.tag}>#travel</span>
            <span className={styles.tag}>#winter</span>
        </div>
    </div>
}



export default GameCard;
