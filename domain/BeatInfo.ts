import { JsonProperty, JsonClassType, ObjectMapper } from 'jackson-js';

export class BeatInfo {
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

