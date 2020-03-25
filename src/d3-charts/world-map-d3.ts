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
        grey: "#eee",
        mapStrokeNormal: '#aaa',
        mapStrokeHoverHighlight: '#222',
        mapStrokeHoverDim: 'rgba(0,0,0,0)',
    };
    monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getStrokeWidth = () => this.dimension.svgWidth >= 1000 ? 1 : 0.5;
    animations = {
      zoomIn: {
          delay: 0,
          duration: 3000,
      },
      changeMapColor: {
          delay: 3000,
          duration: 1000,
      },
      timeLapse: {
          delay: 4000,
      }
    };
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
        timeMax: number,
        tooltipData: {
            inputX: number, // top left x of map path rect, used as primary anchor
            inputXSecondary: number, // top right x of map path rect, used in case primary anchor causing tooltip overlaps map rect
            inputY: number, // top right y of map path rect
            inputYSecondary: number, // bottom right y of map path rect
            data: {
                country: string,
                case: {
                    cases: number[],
                    deaths: number[],
                    recovered: number[],
                } | undefined
            }
        }
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
            timeMax: 0,
            tooltipData: {
                inputX: -1000,
                inputXSecondary: -1000,
                inputY: -1000,
                inputYSecondary: -1000,
                data: {
                    country: '',
                    case: undefined
                }
            }
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
            // .attr('alignment-baseline', 'bottom')
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

        this.updateTooltip()

    }

    updateTooltip() {
        if (!this.references.tooltip) return;

        const {
            inputX, // top left x of map path rect, used as primary anchor
            inputXSecondary, // top right x of map path rect, used in case primary anchor causing tooltip overlaps map rect
            inputY, // top right y of map path rect
            inputYSecondary, // bottom right y of map path rect
            data
        } = this.state.tooltipData;

        const getNew = (num: number) => {
            return num >= 0 ? ` (+${num})` : ` (${num})`
        };

        const currentT = this.state.time;
        const date = new Date(this.data.case.series[currentT]);
        const dateText = `${date.getDate()} ${this.monthStrings[date.getMonth()]}, ${date.getFullYear()}`;
        const noData = 'Unknown';

        this.references.tooltip.tspanCountry.text(data.country);
        this.references.tooltip.tspanDate.text(dateText);
        if (!data.case) {
            // no data
            this.references.tooltip.tspanCaseAccumulative.text(`Confirmed: ${noData}`);
            this.references.tooltip.tspanCaseNew.text('');
            this.references.tooltip.tspanDeathAccumulative.text(`Death: ${noData}`);
            this.references.tooltip.tspanDeathNew.text('');
            this.references.tooltip.tspanRecoveredAccumulative.text(`Recovered: ${noData}`);
            this.references.tooltip.tspanRecoveredNew.text('');
        } else {
            this.references.tooltip.tspanCaseAccumulative.text(`Confirmed: ${data.case.cases[currentT]}`);
            this.references.tooltip.tspanCaseNew.text(currentT === 0 ? getNew(0) : getNew(data.case.cases[currentT] - data.case.cases[currentT - 1]));
            this.references.tooltip.tspanDeathAccumulative.text(`Death: ${data.case.deaths[currentT]}`);
            this.references.tooltip.tspanDeathNew.text(currentT === 0 ? getNew(0) : getNew(data.case.deaths[currentT] - data.case.deaths[currentT - 1]));
            this.references.tooltip.tspanRecoveredAccumulative.text(`Recovered: ${data.case.recovered[currentT]}`);
            this.references.tooltip.tspanRecoveredNew.text(currentT === 0 ? getNew(0) : getNew(data.case.recovered[currentT] - data.case.recovered[currentT - 1]));
        }

        const bBox = this.references.tooltip.tooltip.node()?.getBBox();
        if (!bBox) return;
        const p = 0.2;
        const shift = 5;
        const tooltipWidth = (1+p)*bBox.width;
        const tooltipHeight = (1+p)*bBox.height;

        const xBg = inputX - tooltipWidth - shift;
        const xBgFloored = Math.max(this.dimension.m.l, xBg);
        let textX, tooltipX;
        let y = inputY;
        if (xBgFloored + tooltipWidth > inputX) {
            // overlapping with map rect
            tooltipX = inputXSecondary + shift;
            if (tooltipX + tooltipWidth > this.dimension.svgWidth) {
                // tooltip overflows viewport right edge now
                // fallback to use primary x and use secondary y
                tooltipX = xBgFloored;
                textX = tooltipX + 0.5*tooltipWidth;
                y = inputYSecondary
            } else {
                textX = tooltipX + 0.5*tooltipWidth
            }
        } else {
            tooltipX = xBgFloored;
            textX = tooltipX + 0.5*tooltipWidth
        }

        y = Math.min(y, this.dimension.svgHeight - tooltipHeight);
        this.references.tooltip.tooltip
            .attr('x', textX)
            .attr('y', y)
        this.references.tooltip.tspanCountry
            .attr('x', textX)
            .attr('dy', '0.875em')
        this.references.tooltip.tspanDate
            .attr('x', textX)
            .attr('dy', '1em')
        this.references.tooltip.tspanCaseAccumulative
            .attr('x', textX)
            .attr('dy', '1em')

        this.references.tooltip.tspanDeathAccumulative
            .attr('x', textX)
            .attr('dy', '1em')

        this.references.tooltip.tspanRecoveredAccumulative
            .attr('x', textX)
            .attr('dy', '1em')

        this.references.tooltip.bg
            .attr('x', tooltipX)
            .attr('y', y - p/2*bBox.height)
            .attr('width', tooltipWidth)
            .attr('height', tooltipHeight)
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
            .style("stroke", this.color.mapStrokeNormal)
            .style("stroke-width", this.getStrokeWidth())
            .style('opacity', 0)
            .style('transform', 'scale(5)')
            .style('transform-origin', '50% 50%');
    }

    mapZoomIn() {
        if (!this.references.mapPaths) return;
        this.references.mapPaths.transition()
            .delay((d, i) => (i % 10) * 200)
            .duration(1000)
            .style('opacity', 1)
            .style('transform', 'scale(1)');

        // change map color from grey to white
        this.references.mapPaths.transition()
            .delay(this.animations.changeMapColor.delay)
            .duration(this.animations.changeMapColor.duration)
            .style('fill', this.color.getMapColor(0))
    }

    initDateText() {
        if (!this.references.svg) return;
        this.references.dateText = this.references.svg.append("g").append("text")
            .attr('x', this.dimension.svgWidth * 0.5)
            .attr('y', this.dimension.svgWidth >= 1000 ? this.dimension.svgHeight - 30 : this.dimension.svgHeight - 15)
            .attr('font-size', this.dimension.svgWidth >= 1000 ? '1.5rem' : '0.875rem')
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
                this.updateTooltip();
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
            const xSecondary = bBox.x + bBox.width;
            const ySecondary = bBox.y + bBox.height;

            // tooltip
            if (!d.properties.case) {
                // no data for this country
                thisClass.state.tooltipData = Object.assign(
                    thisClass.state.tooltipData,
                    {
                        inputX: x,
                        inputXSecondary: xSecondary,
                        inputY: y,
                        inputYSecondary: ySecondary,
                        data: {
                            country: d.properties.name,
                            case: null
                        }
                })
            } else {
                thisClass.state.tooltipData = Object.assign(
                    thisClass.state.tooltipData,
                    {
                        inputX: x,
                        inputXSecondary: xSecondary,
                        inputY: y,
                        inputYSecondary: ySecondary,
                        data: {
                            country: d.properties.name,
                            case: {...d.properties.case}
                        }
                    }
                );
                //     thisClass.updateTooltip(x, xSecondary, y, ySecondary, {
                //     country: d.properties.name,
                //     date: `${date.getDate()} ${thisClass.monthStrings[date.getMonth()]}, ${date.getFullYear()}`,
                //     caseAccumulative: d.properties.case.cases[time],
                //     deathAccumulative: d.properties.case.deaths[time],
                //     recoveredAccumulative: d.properties.case.recovered[time],
                //     caseNew: time === 0 ? 0 : d.properties.case.cases[time] - d.properties.case.cases[time-1],
                //     deathNew: time === 0 ? 0 : d.properties.case.deaths[time] - d.properties.case.deaths[time-1],
                //     recoveredNew: time === 0 ? 0 : d.properties.case.recovered[time] - d.properties.case.recovered[time-1],
                // })
            }
            thisClass.updateTooltip();

            // country path
            const thisCountryName = d.properties.name;
            // thisClass.references.mapPaths
            //     ?.style('stroke-width', (_) => {
            //         return _.properties.name === thisCountryName ? 5 : thisClass.dimension.svgWidth >= 1000 ? 1 : 0.5
            //     })
            // d3.select(this)
            //     .style('stroke', thisClass.color.mapStrokeHoverHighlight)
            d3.select(this)
                .style('stroke-width', 5)

        })
            .on('mouseleave', function(d) {
                thisClass.state.tooltipData = Object.assign(
                    thisClass.state.tooltipData,
                    {
                        inputX: -1000,
                        inputXSecondary: -1000,
                        inputY: -1000,
                        inputYSecondary: -1000,
                        data: {
                            country: '',
                            case: null
                        }
                    }
                );
                thisClass.updateTooltip();


                // country path
                // d3.select(this).style('stroke', thisClass.color.mapStrokeNormal)
                // const thisCountryName = d.properties.name;
                thisClass.references.mapPaths?.style("stroke-width", thisClass.getStrokeWidth())
            })
    }

    async main() {
        try {
            await this.getData();
            this.initSvg();
            this.initMap();
            this.initDateText();
            this.initTooltip();
            this.mapZoomIn();
            this.appendMouseEvent();
            setTimeout(
                () => {
                    this.startTimeLapse()
                }, this.animations.timeLapse.delay);
        } catch (e) {
            console.log(e);
        }
    }
}

export default WorldMapD3