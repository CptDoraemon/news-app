import * as d3 from "d3";

export interface CovidCaseData {
    countries: {
        [key: string]: {
            cases: number[],
            deaths: number[],
            recovered: number[],
        }
    }
    series: string[],
    totals: {
        cases: number[],
        deaths: number[],
        recovered: number[],
    },
    lastUpdated: string
}

interface FeatureProperties {
    name: string,
    case?: {
        cases: number[],
        deaths: number[],
        recovered: number[],
    }
}

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
        map: d3.ExtendedFeatureCollection | null,
        case: CovidCaseData
    };
    references: {
        svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null,
        mapPaths: d3.Selection<SVGPathElement, d3.ExtendedFeature, SVGGElement, any> | null,
    };

    constructor(id: string, width: number, themeColor: string, caseData: CovidCaseData) {
        this.id = id;
        this.dimension = this.getDimension(width);
        this.themeColor = themeColor;
        this.data = {
            map: null,
            case: caseData
        };
        this.references = {
            svg: null,
            mapPaths: null
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

    async getData() {
        try {
            const module = await import('./world-map-data');
            const mapData = module.default;
            mapData.features.forEach(obj => {
                if (!obj.properties) return;
                obj.properties.case = Object.assign({}, this.data.case.countries[obj.properties.name])
            });
            this.data.map = mapData;
            console.log(mapData);

            // const casesCountries = Object.keys(this.data.case.countries).sort((a, b) => a.localeCompare(b));
            // const mapCountries = this.data.map.features.map(obj=>obj.properties!.name).sort((a, b) => a.localeCompare(b));
            // console.log(casesCountries, mapCountries);
            //
            // const casesCountriesFiltered: string[] = [];
            // const mapCountriesFiltered: string[] = [];
            //
            // casesCountries.forEach(str => {
            //     if (mapCountries.indexOf(str) === -1) {
            //         casesCountriesFiltered.push(str)
            //     }
            // })
            //
            // mapCountries.forEach(str => {
            //     if (casesCountries.indexOf(str) === -1) {
            //         mapCountriesFiltered.push(str)
            //     }
            // })
            // console.log(casesCountriesFiltered, mapCountriesFiltered)
        } catch (e) {
            throw (e)
        }
    }

    initSvg() {
        this.references.svg = d3.select(`#${this.id}`)
            .append('svg')
            .attr('width', this.dimension.svgWidth)
            .attr('height', this.dimension.svgHeight)
        // .style('background-color', 'rgba(255,0,0,0.5');
    }

    initMap() {
        if (!this.data.map) return;

        const projection = d3.geoNaturalEarth1()
            .fitExtent([[this.dimension.mapX, this.dimension.mapY], [this.dimension.mapWidth, this.dimension.mapHeight]], this.data.map);

        this.references.mapPaths = this.references.svg!.append("g")
            .selectAll("path")
            .data(this.data.map.features)
            .enter().append("path")
            .attr("fill", "#eee")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#222")
            .style('opacity', 0)
            .style('transform', 'scale(5)')
            .style('transform-origin', '50% 50%');

        this.references.mapPaths.transition()
            .delay((d, i) => (i % 10) * 200)
            .duration(1000)
            .style('opacity', 1)
            .style('transform', 'scale(1)');
    }

    async main() {
        try {
            await this.getData();
            this.initSvg();
            this.initMap();
        } catch (e) {
            console.log(e);
        }
    }
}

export default WorldMapD3