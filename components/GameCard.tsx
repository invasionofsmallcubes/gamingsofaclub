import React from 'react'
import { NextPage } from 'next'
import styles from "../styles/GameCard.module.css";
import { Game } from "../domain/Game"

interface Props {
    game: Game
}

const GameCard: NextPage<Props> = (props: Props) => {
    const { game } = props
    console.log(game.platforms)
    const platforms = game.platforms.map(function(item, i) { return <span key={i} className={styles.tag}>{p}</span>})
    return <div className={styles.main}>
        <div className={styles.below}>
            <div className={styles.title}>#{game.rank}</div>
        </div>
        <div className={styles.imageCnt}>
            <img className={styles.image} src={game.imageUrl} alt={game.slug} />
        </div>
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
            <div className={styles.htlbContent}>
                <p className={styles.hltbTitle}>HowLongToBeat™ Data:</p>
                <p className={styles.hltbData}>Main: {game.beatInfo.main} hours, Extra: {game.beatInfo.mainExtra} hours, Completionist: {game.beatInfo.completionist} hours</p>
            </div>
        </div>
        <div className={styles.tags}>
            {platforms}
        </div>
    </div>
}



export default GameCard;
