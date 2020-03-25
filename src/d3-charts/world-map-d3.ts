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
        dateText: d3.Selection<SVGTextElement, unknown, HTMLElement, any> | null,
        tooltip: {
            bg: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
            tooltip: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCountry: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDate: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCaseAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDeathAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanRecoveredAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCaseNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDeathNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanRecoveredNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
        } | null
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
            dateText: null,
            tooltip: null
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

    initTooltip() {
        if (!this.references.svg) return;
        const tooltipG = this.references.svg.append('g');
        const bg = tooltipG.append('rect');
        const tooltip = tooltipG.append('text');
        const tspanCountry = tooltip.append('tspan');
        const tspanDate = tooltip.append('tspan');
        const tspanCaseAccumulative = tooltip.append('tspan');
        const tspanCaseNew = tooltip.append('tspan');
        const tspanDeathAccumulative = tooltip.append('tspan');
        const tspanDeathNew = tooltip.append('tspan');
        const tspanRecoveredAccumulative = tooltip.append('tspan');
        const tspanRecoveredNew = tooltip.append('tspan');

        tooltip
            .style('font-weight', 700)
            .style('font-size', '0.875rem')
            .style('fill', '#fff')
            .attr("text-anchor", "middle")
        // tspanCountry
        // tspanDate
        // tspanCaseAccumulative
        // tspanDeathAccumulative
        // tspanRecoveredAccumulative
        tspanCaseNew
            .style('fill', '#ffa726')
        tspanDeathNew
            .style('fill', '#ef5350')
        tspanRecoveredNew
            .style('fill', '#66bb6a')

        bg
            .style('fill', 'rgba(0,0,0,0.8)')
            .attr('rx', '5px');

        this.references.tooltip = {
            bg,
            tooltip,
            tspanCountry,
            tspanDate,
            tspanCaseAccumulative,
            tspanDeathAccumulative,
            tspanRecoveredAccumulative,
            tspanCaseNew,
            tspanDeathNew,
            tspanRecoveredNew
        };

        this.updateTooltip(200, 200, {
            country: 'country',
            date: 'date',
            caseAccumulative: 1,
            deathAccumulative: 2,
            recoveredAccumulative: 3,
            caseNew: 11,
            deathNew: 22,
            recoveredNew: 33
        })

    }

    updateTooltip(
        inputX: number,
        inputY: number,
        data: {
            country: string,
            date: string,
            caseAccumulative: number,
            deathAccumulative: number,
            recoveredAccumulative: number,
            caseNew: number,
            deathNew: number,
            recoveredNew: number
        }
    ) {
        if (!this.references.tooltip) return;

        this.references.tooltip.tspanCountry.text(data.country);
        this.references.tooltip.tspanDate.text(data.date);
        this.references.tooltip.tspanCaseAccumulative.text(`Confirmed: ${data.caseAccumulative}`);
        this.references.tooltip.tspanCaseNew.text(data.caseNew >= 0 ? ` (+${data.caseNew})` : ` (${data.caseNew})`);
        this.references.tooltip.tspanDeathAccumulative.text(`Death: ${data.deathAccumulative}`);
        this.references.tooltip.tspanDeathNew.text(data.deathNew >= 0 ? ` (+${data.deathNew})` : ` (${data.deathNew})`);
        this.references.tooltip.tspanRecoveredAccumulative.text(`Recovered: ${data.recoveredAccumulative}`);
        this.references.tooltip.tspanRecoveredNew.text(data.recoveredNew >= 0 ? ` (+${data.recoveredNew})` : ` (${data.recoveredNew})`);

        const bBox = this.references.tooltip.tooltip.node()?.getBBox();
        if (!bBox) return;
        const p = 0.2;
        const x = inputX - bBox.width*0.5*(1+0.5*p);
        const y = inputY;

        this.references.tooltip.tooltip
            .attr('x', x)
            .attr('y', y)
        this.references.tooltip.tspanCountry
            .attr('x', x)
            .attr('dy', 0)
        this.references.tooltip.tspanDate
            .attr('x', x)
            .attr('dy', '1rem')
        this.references.tooltip.tspanCaseAccumulative
            .attr('x', x)
            .attr('dy', '1rem')

        this.references.tooltip.tspanDeathAccumulative
            .attr('x', x)
            .attr('dy', '1rem')

        this.references.tooltip.tspanRecoveredAccumulative
            .attr('x', x)
            .attr('dy', '1rem')

        this.references.tooltip.bg
            .attr('x', x - bBox.width*(1+p)*0.5)
            .attr('y', inputY - p*bBox.height)
            .attr('width', bBox.width * (1+p))
            .attr('height', bBox.height * (1+p))
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
        const gap = 500;
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

    appendMouseEvent() {
        if (!this.references.mapPaths) return;
        const thisClass = this;
        this.references.mapPaths.on('mouseover', function(d) {
            const bBox = this.getBBox();
            const x = bBox.x;
            const y = bBox.y;
            const time = thisClass.state.time;
            const date = new Date(thisClass.data.case.series[thisClass.state.time]);
            thisClass.updateTooltip(x, y, {
                country: d.properties.name,
                date: `${date.getDate()} ${thisClass.monthStrings[date.getMonth()]}, ${date.getFullYear()}`,
                caseAccumulative: d.properties.case ? d.properties.case.cases[time] : 0,
                deathAccumulative: d.properties.case ? d.properties.case.deaths[time] : 0,
                recoveredAccumulative: d.properties.case ? d.properties.case.recovered[time] : 0,
                caseNew: !d.properties.case ? 0 : time === 0 ? 0 : d.properties.case.cases[time] - d.properties.case.cases[time-1],
                deathNew: !d.properties.case ? 0 : time === 0 ? 0 : d.properties.case.deaths[time] - d.properties.case.deaths[time-1],
                recoveredNew: !d.properties.case ? 0 : time === 0 ? 0 : d.properties.case.recovered[time] - d.properties.case.recovered[time-1],
            })
        })
            .on('mouseleave', function(d) {
                thisClass.updateTooltip(-1000, -1000, {
                    country: '',
                    date: ``,
                    caseAccumulative: 0,
                    deathAccumulative: 0,
                    recoveredAccumulative: 0,
                    caseNew: 0,
                    deathNew: 0,
                    recoveredNew: 0,
                })
            })
    }

    async main() {
        try {
            await this.getData();
            this.initSvg();
            this.initMap();
            this.initTooltip();
            this.appendMouseEvent();
            setTimeout(() => this.startTimeLapse(), 4000);
        } catch (e) {
            console.log(e);
        }
    }
}

export default WorldMapD3