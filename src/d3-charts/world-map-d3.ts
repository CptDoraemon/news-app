import * as d3 from "d3";
import {WorldMapData} from "./world-map-data";

class WorldMapD3 {
    id: string;
    dimension: {
        width: number,
        height: number
    };
    themeColor: string;
    data: {
        map: WorldMapData | null
    };

    constructor(id: string, width: number, themeColor: string) {
        this.id = id;
        this.dimension = this.getDimension(width);
        this.themeColor = themeColor;
        this.data = {
            map: null
        }
    }

    getDimension(width: number) {
        return {
            width: width,
            height: width / 2
        }
    }

    getData() {
        console.log('called');
        // @ts-ignore
        import('./world-map-data')
            .then((module) => {
                const data = module.default;
                this.data = {
                    map: data
                };
                console.log(data);

                const svg = d3.select(`#${this.id}`)
                    .append('svg')
                    .attr('width', this.dimension.width)
                    .attr('height', this.dimension.height);

                const projection = d3.geoNaturalEarth1()
                    // .scale(width / 1.3 / Math.PI)
                    // .translate([width / 2, height / 2]);

                svg.append("g")
                    .selectAll("path")
                    .data(data.features)
                    .enter().append("path")
                    .attr("fill", this.themeColor)
                    // @ts-ignore
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )
                    .style("stroke", "#fff")
            })
    }

    main() {
        this.getData();
    }
}

export default WorldMapD3