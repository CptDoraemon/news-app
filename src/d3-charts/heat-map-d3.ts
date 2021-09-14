import * as d3 from "d3";

export type HeatMapData = Array<{
  count: number,
  date: number
}>

class HeatMapD3 {

  readonly getColor = (index: number) => {
    const colors = ['#FFF3E0', '#FFE0B2', '#FFB74D', '#FB8C00', '#E65100'];
    return colors[index > colors.length - 1 ? 0 : index]
  };
  readonly dayOfWeekStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly targetRectSize = 70;
  readonly rectPadding = 0.1;
  id: string;
  isMobile: boolean;
  params: {
    width: number,
    height: number,
    m: { t: number, r: number, b: number, l: number },
    chart: {
      width: number,
      height: number,
      x: number,
      y: number
    };
  };
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  references: {
    xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    yAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    rects: d3.Selection<SVGRectElement, { count: number, time: number }, SVGGElement, any>,
    tooltipBackground: d3.Selection<SVGRectElement, unknown, HTMLElement, any>,
    tooltip: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
    tooltipText1: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
    tooltipText2: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
  };
  data: {
    x: number[], // # of week
    y: number[], // # of day of week
    xScaleDomain: string[],
    xScaleGuide: number[],
    yScaleDomain: string[],
    data: Array<{
      count: number,
      time: number
    }>,
    maxCount: number
  };
  scales: {
    x: d3.ScaleBand<string>,
    y: d3.ScaleBand<string>,
    color: d3.ScaleQuantize<number>
  };
  axis: {
    x: d3.Axis<string>,
    y: d3.Axis<string>,
  };

  constructor(id: string, data: HeatMapData, isMobile: boolean) {
    this.id = id;
    this.data = this.getData(data);
    this.isMobile = isMobile;
    this.params = this.getParams();
    this.svg = d3.select(`#${id}`).append("svg");
    this.references = this.createReferences();
    this.scales = this.getScales();
    this.axis = this.getAxis();
  }

  getParams() {
    const container = document.getElementById(this.id);
    const width = container ? container.getBoundingClientRect().width : 0;

    const m = {t: 20, r: 10, b: 10, l: 40};

    const xBands = this.data.xScaleDomain.length;
    const maxRectSize = Math.floor((width - m.l - m.r) / xBands);
    const rectSize = Math.min(maxRectSize, this.targetRectSize);

    const chart = {
      width: this.data.xScaleDomain.length * rectSize,
      height: 7 * rectSize,
      x: m.l,
      y: m.t
    };
    const _width = chart.width + m.l + m.r;
    const height = chart.height + m.t + m.b;

    return {
      width: _width,
      height,
      m,
      chart
    }
  };

  getScales() {
    return {
      x: d3.scaleBand()
        .domain(this.data.xScaleDomain)
        .range([0, this.params.chart.width])
        .padding(this.rectPadding),
      y: d3.scaleBand()
        .domain(this.data.yScaleDomain)
        .range([0, this.params.chart.height])
        .padding(this.rectPadding),
      color: d3.scaleQuantize()
        .domain([0, this.data.maxCount])
        .range([0, 1, 2, 3, 4])
    }
  }

  getAxis() {
    return {
      x: d3.axisTop(this.scales.x)
        .tickFormat((d, i) => {
          const monthOfFirstDate = new Date(this.data.xScaleGuide[0]).getUTCMonth();
          if (i === 0) {
            return this.monthStrings[monthOfFirstDate];
          } else {
            const monthOfLastDate = new Date(this.data.xScaleGuide[i - 1]).getUTCMonth();
            const monthOfThisDate = new Date(this.data.xScaleGuide[i]).getUTCMonth();

            if (monthOfLastDate === monthOfThisDate) {
              return ''
            } else {
              if (this.isMobile) {
                const _diff = monthOfThisDate - monthOfFirstDate;
                const diff = _diff > 0 ? _diff : _diff + 12;
                return diff % 3 === 0 ? this.monthStrings[monthOfThisDate] : ''
              } else {
                return this.monthStrings[monthOfThisDate]
              }
            }
          }
        })
        .tickSize(0)
        .tickPadding(5),
      y: d3.axisLeft(this.scales.y)
        .tickFormat((d) => this.dayOfWeekStrings[parseInt(d)])
        .tickValues(['1', '3', '5'])
        .tickSize(0)
        .tickPadding(5)
    }
  }

  getData(data: HeatMapData) {
    // compensate the data array with empty data first, making the first day of the data array is Sunday.
    const _data = data.map((obj, i) => ({
      count: obj.count,
      time: obj.date
    }));
    const aDay = 1000 * 60 * 60 * 24;
    const firstActualData = new Date(_data[0].time);
    let compensation = firstActualData.getUTCDay();
    let time = _data[0].time;
    while (compensation > 0) {
      compensation--;
      time -= aDay
      _data.unshift({
        count: 0,
        time
      });
    }
    //
    const getY = (time: number[]) => {
      // day of week
      return time.map(_ => (new Date(_)).getUTCDay())
    };

    const getX = (time: number[]) => {
      return time.map((_, i) => Math.floor(i / 7))
    };

    const timeArray = _data.map(_ => _.time);
    const computedX = getX(timeArray);
    const xScaleDomain = [];
    const xScaleGuide = [];
    for (let i = 0; i <= computedX[computedX.length - 1]; i++) {
      xScaleDomain.push(i.toString());
      xScaleGuide.push(_data[i * 7].time);
    }
    //
    const computedY = getY(timeArray);
    const yScaleDomain = [];
    for (let i = 0; i < 7; i++) {
      yScaleDomain.push(i.toString())
    }
    //
    const maxCount = Math.max.apply(Math, _data.map(_ => _.count));
    return {
      x: computedX,
      y: computedY,
      xScaleDomain,
      xScaleGuide,
      yScaleDomain,
      data: _data,
      maxCount
    }
  }

  createReferences() {
    const xAxis = this.svg.append('g');
    const yAxis = this.svg.append('g');
    const rects = this.svg.append('g')
      .selectAll('rect').data(this.data.data)
      .enter().append('rect');
    // tooltips has to be here to be rendered on top
    const tooltipGroup = this.svg.append('g');
    const tooltipBackground = tooltipGroup.append('rect');
    const tooltip = tooltipGroup.append('text');

    return {
      xAxis,
      yAxis,
      rects,
      tooltipBackground,
      tooltip,
      tooltipText1: tooltip.append('tspan'),
      tooltipText2: tooltip.append('tspan'),
    }
  }

  styleSvg() {
    this.svg
      .attr("width", this.params.width)
      .attr("height", this.params.height);
  }

  styleAxisX() {
    this.axis.x(this.references.xAxis);

    this.references.xAxis.selectAll('.domain').remove();

    this.references.xAxis
      .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
      .style('font-size', '0.875rem')
      .style('font-weight', '700');

    this.references.xAxis.selectAll('text')
      .style('fill', 'grey');

  }

  styleAxisY() {
    this.axis.y(this.references.yAxis);

    this.references.yAxis.selectAll('.domain').remove();

    this.references.yAxis
      .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
      .style('font-size', '0.875rem')
      .style('font-weight', '700');

    this.references.yAxis.selectAll('text')
      .style('fill', 'grey');
    // .attr('text-anchor', 'start')
  }

  styleRects() {
    this.references.rects
      .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
      .attr('width', this.scales.x.bandwidth())
      .attr('height', this.scales.y.bandwidth())
      .attr('x', (d, i) => this.scales.x(this.data.x[i].toString()) || 0)
      .attr('y', (d, i) => this.scales.y(this.data.y[i].toString()) || 0);
  }

  styleTooltip() {
    this.references.tooltip
      .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle');

    this.references.tooltipText1
      .style('font-weight', 700)
      .style('fill', 'white');

    this.references.tooltipText2
      .style('fill', 'white');

    this.references.tooltipBackground
      .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
      .style('fill', '#000')
      .style('opacity', 0.8)
      .attr('rx', '5')
      .attr('ry', '5');
  }

  addMouseEventToRects() {
    const thisClass = this;
    // tooltip padding
    const px = 1.2;
    const py = 2.5;

    this.references.rects
      .on('mouseover', function (this: SVGRectElement, d) {
        const x = parseInt(this.getAttribute("x") || '0');
        const y = parseInt(this.getAttribute("y") || '0');
        const width = parseInt(this.getAttribute("width") || '0');
        const height = parseInt(this.getAttribute("height") || '0');

        // append texts to tspans first
        thisClass.references.tooltipText1.text(`${d.count} news archived on `);

        const date = new Date(d.time);
        thisClass.references.tooltipText2.text(`${thisClass.monthStrings[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`)

        // get dimension of text
        // tooltip has text-anchor: middle
        const bBox = thisClass.references.tooltip.node()?.getBBox();
        const textWidth = bBox?.width || 0;
        const textHeight = bBox?.height || 0;
        const tooltipWidth = textWidth * px;
        const tooltipHeight = textHeight * py;
        let toolTipX = x + 0.5 * width;
        let toolTipY = y - 0.5 * tooltipHeight;
        const borderX0 = -thisClass.params.m.l;
        const borderX1 = thisClass.params.width - thisClass.params.m.l;
        const borderY0 = -thisClass.params.m.t;
        const borderY1 = thisClass.params.height - thisClass.params.m.t;
        // handle if x of tooltip is out of border
        if (toolTipX - 0.5 * tooltipWidth < borderX0) {
          toolTipX = borderX0 + 0.5 * tooltipWidth
        } else if (toolTipX + 0.5 * tooltipWidth > borderX1) {
          toolTipX = borderX1 - 0.5 * tooltipWidth;
        }
        // handle if y of tooltip is out of border
        if (toolTipY - tooltipHeight < borderY0) {
          toolTipY = borderY0 + tooltipHeight
        } else if (toolTipY + tooltipHeight > borderY1) {
          toolTipY = borderY1 - 0.5 * tooltipHeight;
        }
        thisClass.references.tooltip
          .attr("x", toolTipX)
          .attr("y", toolTipY);

        // move tooltipBackground
        thisClass.references.tooltipBackground
          .attr("x", toolTipX - 0.5 * tooltipWidth)
          .attr("y", toolTipY - 0.4 * textHeight - 0.5 * tooltipHeight)
          .attr("width", tooltipWidth)
          .attr("height", tooltipHeight);
      })
      .on('mouseleave', function (this: SVGRectElement, d) {
        thisClass.references.tooltip
          .attr("x", -1000)
          .attr("y", -1000);
        thisClass.references.tooltipBackground
          .attr("x", -1000)
          .attr("y", -1000);
      })
  }

  prepareForAnimation() {
    this.references.rects
      .style('fill', this.getColor(3))
  }

  animate() {
    this.references.rects.transition()
      .style('fill', "rgba(255, 255, 255, 0)")
      .duration(500);

    this.references.rects.transition()
      .style('fill', (d) => this.getColor(this.scales.color(d.count)))
      .delay((d) => 500 + this.scales.color(d.count) * 1000)
      .duration(800)
  }

  main() {
    this.styleSvg();
    this.styleAxisX();
    this.styleAxisY();
    this.styleRects();
    this.styleTooltip();
    this.addMouseEventToRects();
    this.prepareForAnimation();
  }
}

export default HeatMapD3
