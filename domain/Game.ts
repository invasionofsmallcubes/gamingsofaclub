
import { JsonProperty, JsonClassType, ObjectMapper } from 'jackson-js'
import { BeatInfo } from './BeatInfo'

export class Game {
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
    @JsonProperty() @JsonClassType({ type: () => [Array, [String]] })
    genres: string[]
    @JsonProperty() @JsonClassType({ type: () => [Array, [String]] })
    platforms: string[]
    constructor(rank: number, name: string,
        slug: string, beatInfo: BeatInfo,
        imageUrl: string, summary: string,
        genres: string[], platforms: string[]) {
        this.rank = rank
        this.name = name
        this.slug = slug
        this.beatInfo = beatInfo
        this.imageUrl = imageUrl
        this.summary = summary
        this.genres = genres
        this.platforms = platforms
    }
}
