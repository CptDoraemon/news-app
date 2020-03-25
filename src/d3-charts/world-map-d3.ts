import * as d3 from "d3";

class WorldMapD3 {
    id: string;
    dimension: {
        svgWidth: number,
        svgHeight: number,
        m: {t: number, r: number, b: number, l: number},
        mapX: number,
        mapY: number
        mapWidth: number,
        mapHeight: number
    };
    themeColor: string;
    data: {
        map: d3.ExtendedFeatureCollection | null
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
        const svgWidth = width;
        const svgHeight = Math.min(width / 2, window.innerHeight * 0.7);
        const m = {t: 0, r: 10, b: 0, l: 10};
        return {
            svgWidth,
            svgHeight,
            m,
            mapX: m.l,
            mapY: m.t,
            mapWidth: svgWidth - m.l - m.r,
            mapHeight: svgHeight - m.t - m.b
        }
    }

    getData() {
        import('./world-map-data')
            .then((module) => {
                const data = module.default;
                this.data = {
                    map: data
                };
                console.log(data);

                const svg = d3.select(`#${this.id}`)
                    .append('svg')
                    .attr('width', this.dimension.svgWidth)
                    .attr('height', this.dimension.svgHeight)
                    // .style('background-color', 'rgba(255,0,0,0.5');

                const projection = d3.geoNaturalEarth1()
                    .fitExtent([[this.dimension.mapX, this.dimension.mapY], [this.dimension.mapWidth, this.dimension.mapHeight]], data);

                svg.append("g")
                    .selectAll("path")
                    .data(data.features)
                    .enter().append("path")
                    .attr("fill", this.themeColor)
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