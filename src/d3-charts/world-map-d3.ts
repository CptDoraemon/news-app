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
    case: {
        cases: number[],
        deaths: number[],
        recovered: number[],
    } | null
}

class WorldMapD3 {
    color = {
        red: '#ef5350',
        getMapColor: (percentage: number) => `rgba(255, 166, 0, ${percentage.toFixed(1)})`,
        grey: "#eee"
    };
    monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        aggregate: d3.ExtendedFeatureCollection<d3.ExtendedFeature<d3.GeoGeometryObjects, FeatureProperties>> | null,
        case: CovidCaseData,
        caseMax: number
    };
    references: {
        svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null,
        mapPaths: d3.Selection<SVGPathElement, d3.ExtendedFeature<d3.GeoGeometryObjects, FeatureProperties>, SVGGElement, any> | null,
        dateText: d3.Selection<SVGTextElement, unknown, HTMLElement, any> | null
    };
    state: {
        time: number,
        timeMax: number
    };

    constructor(id: string, width: number, themeColor: string, caseData: CovidCaseData) {
        this.id = id;
        this.dimension = this.getDimension(width);
        this.themeColor = themeColor;
        this.data = {
            aggregate: null,
            case: caseData,
            caseMax: 0
        };
        this.references = {
            svg: null,
            mapPaths: null,
            dateText: null
        };
        this.state = {
            time: 0,
            timeMax: 0
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
            let caseMax = 0;
            const mapData: any = module.default;
            mapData.features.forEach((obj: any) => {
                if (!obj.properties) return;
                obj.properties.case = this.data.case.countries[obj.properties.name] ?
                    Object.assign({}, this.data.case.countries[obj.properties.name]) :
                    null;

                this.data.case.countries[obj.properties.name]?.cases.forEach(num => {
                    if (num > caseMax) caseMax = num
                })
            });
            this.data.aggregate = mapData;
            this.data.caseMax = caseMax;
            this.state.timeMax = this.data.case.series.length - 1;

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
        if (!this.data.aggregate || !this.references.svg) return;

        const projection = d3.geoNaturalEarth1()
            .fitExtent([[this.dimension.mapX, this.dimension.mapY], [this.dimension.mapWidth, this.dimension.mapHeight]], this.data.aggregate);

        this.references.mapPaths = this.references.svg.append("g")
            .selectAll("path")
            .data(this.data.aggregate.features)
            .enter().append("path")
            .attr("fill", this.color.grey)
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#222")
            .style("stroke-width", this.dimension.svgWidth >= 1000 ? 1 : 0.5)
            .style('opacity', 0)
            .style('transform', 'scale(5)')
            .style('transform-origin', '50% 50%');

        this.references.mapPaths.transition()
            .delay((d, i) => (i % 10) * 200)
            .duration(1000)
            .style('opacity', 1)
            .style('transform', 'scale(1)');

        this.references.dateText = this.references.svg.append("g").append("text")
            .attr('x', this.dimension.svgWidth * 0.5)
            .attr('y', this.dimension.svgWidth >= 1000 ? this.dimension.svgHeight - 30 : this.dimension.svgHeight - 15)
            .attr('font-size', this.dimension.svgWidth >= 1000 ? '2rem' : '0.875rem')
            .attr('font-weight', 700)
            .attr('text-anchor', 'middle')
        ;
    }

    startTimeLapse() {
        const gap = 1000;
        const caseMaxLog = Math.log(this.data.caseMax);
        const emptyColor = this.color.getMapColor(0);

        const updateMap = () => {
            if (!this.references.mapPaths) return;
            this.references.mapPaths
                .style('fill', (d) => {
                    if (!d.properties.case) {
                        // no data
                        return emptyColor
                    } else {
                        const currentCases = d.properties.case.cases[this.state.time];
                        if (currentCases < 1) {
                            return emptyColor
                        } else {
                            return this.color.getMapColor(Math.log(currentCases) / caseMaxLog)
                        }
                    }
                })
        };

        const updateDateText = () => {
            const date = new Date(this.data.case.series[this.state.time]);
            this.references.dateText?.text(`${date.getDate()} ${this.monthStrings[date.getMonth()]}, ${date.getFullYear()}`)
        };

        const updateState = () => {
            if (this.state.time <= this.state.timeMax) {
                updateMap();
                updateDateText();
                if (this.state.time < this.state.timeMax) {
                    this.state.time++;
                    setTimeout(updateState, gap)
                }
            }
        };

        updateState();
    }

    async main() {
        try {
            await this.getData();
            this.initSvg();
            this.initMap();
            setTimeout(() => this.startTimeLapse(), 4000);
        } catch (e) {
            console.log(e);
        }
    }
}

export default WorldMapD3