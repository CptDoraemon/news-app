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
        transparent: 'rgba(0,0,0,0)',
        getMapColor: (percentage: number) => `rgba(55, 76, 128, ${percentage.toFixed(1)})`,
        grey: "#eee",
        mapStrokeNormal: '#ccc',
        mapStrokeHoverHighlight: '#222',
        case: '#ffa726',
        death: '#f16a67',
        recovered: '#78c37b',
        timeBarHighlight: '#7a5195',
        timeBarNormal: '#af96bf',
        timeBarLight: '#e4dbe8'
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
        },
        timeLapseGap: 500
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
        map: {
            paths: d3.Selection<SVGPathElement, d3.ExtendedFeature<d3.GeoGeometryObjects, FeatureProperties>, SVGGElement, any> | null,
            pathHighlightGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
            pathHighlight: d3.Selection<SVGPathElement | null, unknown, HTMLElement, any> | null,
        }
        tooltip: {
            bg: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
            tooltipGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>
            tooltip: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCountry: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDate: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCaseAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDeathAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanRecoveredAccumulative: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanCaseNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanDeathNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            tspanRecoveredNew: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            caseLineChart: d3.Selection<SVGPathElement, unknown | [number, number][], HTMLElement, any>,
            deathLineChart: d3.Selection<SVGPathElement, unknown | [number, number][], HTMLElement, any>,
            recoveredLineChart: d3.Selection<SVGPathElement, unknown | [number, number][], HTMLElement, any>,
            stackBarChartCase: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
            stackBarChartDeath: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
            stackBarChartRecovered: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
        } | null,
        timeControl: {
            group: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
            dateText: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            timeBarBg: d3.Selection<SVGRectElement, string, SVGGElement, any>,
            timeBar: d3.Selection<SVGRectElement, string, SVGGElement, any>,
            playButton: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
            startOverButton: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
        } | null
    };
    scales: {
        timeBarXScale: d3.ScaleBand<string>
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
                } | undefined | null
            }
        }
    };
    timeLapse: {
        timeoutID: number | null
    };

    constructor(id: string, width: number, height: number, themeColor: string, caseData: CovidCaseData) {
        this.id = id;
        this.dimension = this.getDimension(width, height);
        this.themeColor = themeColor;
        this.data = {
            aggregate: null,
            case: caseData,
            caseMax: 0
        };
        this.references = {
            svg: null,
            map: {
                paths: null,
                pathHighlightGroup: null,
                pathHighlight: null
            },
            tooltip: null,
            timeControl: null
        };
        this.scales = {
            timeBarXScale: d3.scaleBand()
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
        };
        this.timeLapse = {
            timeoutID: null
        }
    }

    getDimension(width: number, height: number) {
        const svgWidth = width;
        const svgHeight = height;
        const m = {t: 0, r: 10, b: 75, l: 10};
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
        const tooltipGroup = this.references.svg.append('g');
        const bg = tooltipGroup.append('rect');
        const tooltip = tooltipGroup.append('text');
        const tspanCountry = tooltip.append('tspan');
        const tspanDate = tooltip.append('tspan');
        const tspanCaseAccumulative = tooltip.append('tspan');
        const tspanCaseNew = tooltip.append('tspan');
        const tspanDeathAccumulative = tooltip.append('tspan');
        const tspanDeathNew = tooltip.append('tspan');
        const tspanRecoveredAccumulative = tooltip.append('tspan');
        const tspanRecoveredNew = tooltip.append('tspan');
        const caseLineChart = tooltipGroup.append('path');
        const deathLineChart = tooltipGroup.append('path');
        const recoveredLineChart = tooltipGroup.append('path');
        const stackBarChartGroup = tooltipGroup.append('g');
        const stackBarChartCase = stackBarChartGroup.append('rect');
        const stackBarChartDeath = stackBarChartGroup.append('rect');
        const stackBarChartRecovered = stackBarChartGroup.append('rect');
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
            .style('fill', this.color.case);
        tspanDeathNew
            .style('fill', this.color.death)
        tspanRecoveredNew
            .style('fill', this.color.recovered)

        bg
            .style('fill', 'rgba(0,0,0,0.8)')
            .attr('rx', '5px');

        [caseLineChart, deathLineChart, recoveredLineChart].forEach(_ => {
            _
                .style('stroke-width', 2)
                .style('fill', 'none')
        });
        caseLineChart.style('stroke', this.color.case);
        deathLineChart.style('stroke', this.color.death);
        recoveredLineChart.style('stroke', this.color.recovered);
        //
        stackBarChartCase.style('fill', this.color.case);
        stackBarChartDeath.style('fill', this.color.death);
        stackBarChartRecovered.style('fill', this.color.recovered);


        this.references.tooltip = {
            bg,
            tooltipGroup,
            tooltip,
            tspanCountry,
            tspanDate,
            tspanCaseAccumulative,
            tspanDeathAccumulative,
            tspanRecoveredAccumulative,
            tspanCaseNew,
            tspanDeathNew,
            tspanRecoveredNew,
            caseLineChart,
            deathLineChart,
            recoveredLineChart,
            stackBarChartCase,
            stackBarChartDeath,
            stackBarChartRecovered
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

        // Update texts

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

        // Update dimension and position
        const bBox = this.references.tooltip.tooltip.node()?.getBBox();
        if (!bBox) return;
        const p = 0.3;
        const shift = 5;
        const textWidth = bBox.width;
        const textHeight = bBox.height;
        const lineChartHeight = 20;
        const stackBarChartMarginTop = 10;
        const stackBarChartHeight = 15;
        const chartWidth = 150;
        const tooltipWidth = (1+p)*Math.max(chartWidth, textWidth);
        const tooltipHeight = (1+p)*(textHeight + lineChartHeight * 3 + stackBarChartHeight + stackBarChartMarginTop);

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
        const toolTipStartY = y - p/2*bBox.height;
        const lineChartStartY = toolTipStartY+0.5*p*tooltipHeight+textHeight;
        const stackBarChartY = lineChartStartY + 3 * lineChartHeight + stackBarChartMarginTop;
        this.references.tooltip.tooltip
            .attr('x', textX)
            .attr('y', y);
        this.references.tooltip.tspanCountry
            .attr('x', textX)
            .attr('dy', '0.875em');
        this.references.tooltip.tspanDate
            .attr('x', textX)
            .attr('dy', '1em');
        this.references.tooltip.tspanCaseAccumulative
            .attr('x', textX)
            .attr('dy', '1em');

        this.references.tooltip.tspanDeathAccumulative
            .attr('x', textX)
            .attr('dy', '1em');

        this.references.tooltip.tspanRecoveredAccumulative
            .attr('x', textX)
            .attr('dy', '1em');

        this.references.tooltip.bg
            .attr('x', tooltipX)
            .attr('y', toolTipStartY)
            .attr('width', tooltipWidth)
            .attr('height', tooltipHeight);

        //
        // Update line charts
        const updateLineCharts = (
            dataArray: number[],
            reference: d3.Selection<SVGPathElement, unknown | [number, number][], HTMLElement, any>,
            yMax: number,
            x: number,
            y: number
        ) => {
            const data: [number, number][] = dataArray.map((num, i) => [i, num]);
            const scaleX = d3.scaleLinear()
                .domain([0, this.data.case.series.length-1])
                .range([0, chartWidth]);
            const scaleY = d3.scaleLinear()
                .domain([0, yMax])
                .range([20, 0]);

            reference
                .datum(data)
                .attr('d', d3.line()
                    .x((d) => scaleX(d[0]))
                    .y((d) => scaleY(d[1]))
                    .defined((d, i) => i <= this.state.time)
                )
                .style('transform', `translate(${x}px, ${y}px)`)
        };

        const chartX = textX - chartWidth/2;
        if (this.state.tooltipData.data.case) {
            // has data
            const lineChartYMax = Math.max.apply(Math, this.state.tooltipData.data.case.cases);
            updateLineCharts(this.state.tooltipData.data.case.cases, this.references.tooltip.caseLineChart, lineChartYMax, chartX, lineChartStartY);
            updateLineCharts(this.state.tooltipData.data.case.deaths, this.references.tooltip.deathLineChart, lineChartYMax, chartX, lineChartStartY + lineChartHeight);
            updateLineCharts(this.state.tooltipData.data.case.recovered, this.references.tooltip.recoveredLineChart, lineChartYMax, chartX, lineChartStartY + lineChartHeight*2);
        } else {
            // either no data or mouse is leaving, need to move line chart out
            const nullData: number[] = [];
            updateLineCharts(nullData, this.references.tooltip.caseLineChart, 0, chartX, lineChartStartY);
            updateLineCharts(nullData, this.references.tooltip.deathLineChart, 0, chartX, lineChartStartY + lineChartHeight);
            updateLineCharts(nullData, this.references.tooltip.recoveredLineChart, 0, chartX, lineChartStartY + lineChartHeight*2);
        }

        // update stack bar chart
        const stackBarScale = d3.scaleLinear()
            .domain([0, this.data.case.series.length-1])
            .range([0, 100]);
        if (this.state.tooltipData.data.case) {
            // has data
            const currentCase = this.state.tooltipData.data.case.cases[currentT];
            const currentDeath = this.state.tooltipData.data.case.deaths[currentT];
            const currentRecovered = this.state.tooltipData.data.case.recovered[currentT];
            const deathWidth = currentCase === 0 ? 0 : (currentDeath / currentCase) * chartWidth;
            const recoveredWidth = currentCase === 0 ? 0 : (currentRecovered / currentCase) * chartWidth;
            this.references.tooltip.stackBarChartCase
                .attr('x', chartX)
                .attr('width', () => currentCase === 0 ? 0 : chartWidth)
                .attr('height', stackBarChartHeight)
                .attr('y', stackBarChartY);
            this.references.tooltip.stackBarChartDeath
                .attr('x', chartX + chartWidth - deathWidth)
                .attr('width', deathWidth)
                .attr('height', stackBarChartHeight)
                .attr('y', stackBarChartY);
            this.references.tooltip.stackBarChartRecovered
                .attr('x', chartX)
                .attr('width', recoveredWidth)
                .attr('height', stackBarChartHeight)
                .attr('y', stackBarChartY)
        } else {
            // either no data or mouse is leaving, need to move line chart out
            this.references.tooltip.stackBarChartCase
                .attr('x', chartX)
                .attr('y', stackBarChartY);
            this.references.tooltip.stackBarChartDeath
                .attr('x', chartX)
                .attr('y', stackBarChartY);
            this.references.tooltip.stackBarChartRecovered
                .attr('x', chartX)
                .attr('y', stackBarChartY)
        }
    }

    initMap() {
        if (!this.data.aggregate || !this.references.svg) return;

        const projection = d3.geoNaturalEarth1()
            .fitExtent([[this.dimension.mapX, this.dimension.mapY], [this.dimension.mapWidth, this.dimension.mapHeight]], this.data.aggregate);

        this.references.map.paths = this.references.svg.append("g")
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

        this.references.map.pathHighlightGroup = this.references.svg.append("g");
    }

    mapZoomIn() {
        if (!this.references.map.paths) return;
        this.references.map.paths.transition()
            .delay((d, i) => (i % 10) * 200)
            .duration(1000)
            .style('opacity', 1)
            .style('transform', 'scale(1)');

        // change map color from grey to white
        this.references.map.paths.transition()
            .delay(this.animations.changeMapColor.delay)
            .duration(this.animations.changeMapColor.duration)
            .style('fill', this.color.getMapColor(0))
    }

    initTimeControl() {
        if (!this.references.svg) return;
        // dimensions
        const margin = 4;
        const timeControlStartY = this.dimension.svgHeight - this.dimension.m.b;
        const timeControlStartX = 0.2*this.dimension.svgWidth;
        const dateTextHeight = 16;
        const timeBarStartY = timeControlStartY + dateTextHeight + margin;
        const timeBarHeight = 10;
        const buttonStartY = timeBarStartY + timeBarHeight + margin;
        const buttonHeight = 16;
        //
        const dateArray = this.data.case.series;
        this.scales.timeBarXScale = d3.scaleBand()
            .domain(dateArray)
            .range([timeControlStartX, 0.8*this.dimension.svgWidth]);

        const group = this.references.svg.append("g");
        const dateText = group.append("text")
            .attr('x', timeControlStartX)
            .attr('y', timeControlStartY + dateTextHeight)
            .attr('font-size', `${dateTextHeight}px`)
            .attr('font-weight', 700)
            .style('fill', this.color.timeBarHighlight);
        const [timeBarBg, timeBar] = [0, 1].map(_=>{
            const selection = group.append('g')
                .selectAll('rect')
                .data(dateArray)
                .enter()
                .append('rect')
                .style('cursor', 'pointer')
                .attr('y', timeBarStartY)
                .attr('x', (d) => `${this.scales.timeBarXScale(d)}`)
                .attr('width', this.scales.timeBarXScale.bandwidth())
                .attr('height', timeBarHeight)
                .style('opacity', 0);
            selection
                .transition()
                .delay(2000)
                .duration(1000)
                .style('opacity', 1);
            return selection
        });
        timeBarBg
            .style('fill', this.color.timeBarLight)
            .style('stroke', `#fff`)
            .style('stroke-width', 1);
        timeBar
            .style('fill', this.color.transparent);

        const buttonGroup = group.append('g');
        const [playButton, startOverButton] = [
            {
                y: buttonStartY + buttonHeight,
                text: 'Pause'
            },
            {
                y: buttonStartY + buttonHeight * 2,
                text: 'Start Over'
            }
        ].map(_=>{
            const selection = buttonGroup
                .append('text')
                .style('cursor', 'pointer')
                .style('opacity', '0')
                .style('fill', this.color.timeBarNormal)
                .attr('font-weight', 700)
                .attr('x', timeControlStartX)
                .attr('y', _.y)
                .text(_.text);
            selection.transition()
                .delay(this.animations.timeLapse.delay)
                .duration(1000)
                .style('opacity', 1);
            selection
                .on('mouseenter', () => {
                selection.style('fill', this.color.timeBarHighlight)
                })
                .on('mouseleave', () => {
                selection.style('fill', this.color.timeBarNormal)
                });
            return selection
        });
        this.references.timeControl = {
            group,
            dateText,
            timeBarBg,
            timeBar,
            playButton,
            startOverButton
        };
    }

    updateTimeControl() {
        if (!this.references.timeControl) return;

        const currentT = this.state.time;
        const date = new Date(this.data.case.series[currentT]);
        this.references.timeControl.dateText.text(`${date.getDate()} ${this.monthStrings[date.getMonth()]}, ${date.getFullYear()}`)

        this.references.timeControl.timeBar
            .style('fill', (d, i) => i <= this.state.time ? this.color.timeBarNormal : this.color.transparent)
            // .style('stroke', this.color.transparent)
        this.references.timeControl.timeBar.filter((d, i) => i === this.state.time)
            .transition()
            .duration(this.animations.timeLapseGap)
            .attrTween('width', (d) => (t: number) => `${t*this.scales.timeBarXScale.bandwidth()}px`)
            .ease(d3.easeLinear)
    }

    updateMap() {
        const caseMaxLog = Math.log(this.data.caseMax);
        const emptyColor = this.color.getMapColor(0);

        if (!this.references.map.paths) return;
        this.references.map.paths
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
    }

    setTimeState(time: number) {
        this.state.time = time;
        this.updateMap();
        this.updateTimeControl();
        this.updateTooltip();
    }

    setToolTipDataState(
        x: number,
        xSecondary: number,
        y : number,
        ySecondary: number,
        country: string,
        newCase: typeof WorldMapD3.prototype.state.tooltipData.data.case
    ) {
        this.state.tooltipData = Object.assign(
            this.state.tooltipData,
            {
                inputX: x,
                inputXSecondary: xSecondary,
                inputY: y,
                inputYSecondary: ySecondary,
                data: {
                    country: country,
                    case: newCase
                }
            })
    }

    startTimeLapse(isWaitFirstTick?: boolean) {
        const tick = () => {
            if (this.state.time < this.state.timeMax) {
                this.setTimeState(this.state.time+1);
                this.timeLapse.timeoutID = window.setTimeout(tick, this.animations.timeLapseGap)
            } else {
                this.stopTimeLapse()
            }
        };

        this.references.timeControl?.playButton.text('Pause');
        if (isWaitFirstTick) {
            this.timeLapse.timeoutID = window.setTimeout(() => tick(), this.animations.timeLapseGap)
        } else {
            tick();
        }
    }

    stopTimeLapse() {
        this.references.timeControl?.playButton.text('Start');

        if (this.timeLapse.timeoutID !== null) {
            window.clearTimeout(this.timeLapse.timeoutID);
            this.timeLapse.timeoutID = null;
        }
    }

    appendTimeBarMouseEvent() {
        if (!this.references.timeControl) return;

        const thisClass = this;
        this.references.timeControl.timeBar
            .on('mouseenter', function() {
            d3.select(this).style('fill', thisClass.color.timeBarHighlight)
            })
            .on('mouseleave', function(d, i) {
                d3.select(this).style('fill', i <= thisClass.state.time ? thisClass.color.timeBarNormal : thisClass.color.transparent)
            })
            .on('click', function(d, i) {
                thisClass.stopTimeLapse();
                thisClass.setTimeState(i)
            })
    }

    appendTimeControlButtonEvent() {
        if (!this.references.timeControl) return;

        this.references.timeControl.playButton.on('click', () => {
            if (this.timeLapse.timeoutID !== null) {
                this.stopTimeLapse();
            } else {
                this.startTimeLapse();
            }
        });

        this.references.timeControl.startOverButton.on('click', () => {
            this.stopTimeLapse();
            this.setTimeState(0);
            this.startTimeLapse(true);
        });
    }

    appendMapPathMouseEvent() {
        // when mouse enter a country:
        // 1. use d3.selection.clone() to clone the country path, the cloned path will be append right after the original path.
        // 2. remove this path and append it into the pathHighlightGroup using d3.selection.append(() => clonedNode.node())
        // 3. the cloned the path will be on the top of all the paths therefore the stroke on it will be totally visible.
        // 4. however this cloned path is on the top of is origin too, therefore will trigger it's origin's mouseleave listener
        // 5. remove the clone in the clone's mouseleave listener
        // 6. sometimes the mouseover listener will be triggered before clone's mouseleave listener, therefore always remove the clone at the beginning of mouseover listener

        // TODO: Known bug: on smaller screen, the tooltips may overlaps current mouse position, therefore the mouse is never gonna enter the cloned map path,
        //  so the mouseleave will never be triggered and tooltips won't be repositioned.

        if (!this.references.map.paths) return;
        const thisClass = this;

        const removeHighlightAndMoveTooltip = () => {
            thisClass.setToolTipDataState(-1000, -1000, -1000, -1000, '', null);
            thisClass.updateTooltip();
            thisClass.references.map.pathHighlight?.remove();
        };

        this.references.map.paths.on('mouseenter', function(d) {
            removeHighlightAndMoveTooltip();

            const bBox = this.getBBox();
            const x = bBox.x;
            const y = bBox.y;
            const xSecondary = bBox.x + bBox.width;
            const ySecondary = bBox.y + bBox.height;

            // tooltip
            if (!d.properties.case) {
                // no data for this country
                thisClass.setToolTipDataState(x, xSecondary, y, ySecondary, d.properties.name, null);
            } else {
                thisClass.setToolTipDataState(x, xSecondary, y, ySecondary, d.properties.name, {...d.properties.case});
            }
            thisClass.updateTooltip();

            // country path
            const clonedNode = d3.select(this).clone().remove();
            if (thisClass.references.map.pathHighlightGroup) {
                const movedClonedNode = thisClass.references.map.pathHighlightGroup.append(() => clonedNode.node());
                if (movedClonedNode) {
                    thisClass.references.map.pathHighlight = movedClonedNode;
                    movedClonedNode
                        .style('stroke', thisClass.color.mapStrokeHoverHighlight)
                        .style('stroke-width', thisClass.getStrokeWidth()*2)
                        .style('fill', thisClass.color.transparent);
                    movedClonedNode.on('mouseleave', function() {
                        removeHighlightAndMoveTooltip()
                    })
                }
            }
        })
    }

    async main() {
        try {
            await this.getData();
            this.initSvg();
            this.initMap();
            this.initTimeControl();
            this.initTooltip();
            this.mapZoomIn();
            this.appendMapPathMouseEvent();
            this.appendTimeBarMouseEvent();
            setTimeout(
                () => {
                    this.startTimeLapse();
                    this.appendTimeControlButtonEvent();
                }, this.animations.timeLapse.delay);
        } catch (e) {
            console.log(e);
        }
    }
}

export default WorldMapD3