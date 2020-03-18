import * as d3 from "d3";

type BarChartData = ArcData[];

type ArcData = {
    title: string,
    value: number
}

class BarChartD3 {

    readonly getColor = (index: number) => {
        const colors = ['#99B898', '#F8B195', '#F67280' ,'#C06C84' ,'#6C5B7B' ,'#355C7D' ,'#2A363B'];
        return colors[index > colors.length - 1 ? 0 : index]
    };
    id: string;
    width: number;
    height: number;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    references: {
        pie: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        innerSlice: d3.Selection<SVGPathElement, d3.PieArcDatum<ArcData>, SVGGElement, any>,
        topSlice: d3.Selection<SVGPathElement, d3.PieArcDatum<ArcData>, SVGGElement, any>,
        outerSlice: d3.Selection<SVGPathElement, d3.PieArcDatum<ArcData>, SVGGElement, any>,
        text: d3.Selection<SVGTextElement, d3.PieArcDatum<ArcData>, SVGGElement, any>,
    };
    data: {
        data: BarChartData,
        pie: d3.PieArcDatum<ArcData>[],
    };

    constructor(id: string, data: BarChartData, width: number) {
        this.id = id;
        this.width = width;
        this.height = width;
        this.svg = d3.select(`#${id}`).append("svg");
        this.data = {
            data,
            // pie: this.getPie(data.map(_=>_.value))
            pie: this.getPieData(data)
        };
        this.references = this.createReferences();
    }

    createReferences() {
        // const innerSliceClass = `${this.id}-innerSlice`;
        // const topSliceClass = `${this.id}-topSlice`;
        // const outerSliceClass = `${this.id}-outerSlice`;
        // const textClass = `${this.id}-text`;

        const pie = this.svg.append('g');

        const innerSlice = pie
            .selectAll().data(this.data.pie).enter().append("path");

        const topSlice = pie
            .selectAll().data(this.data.pie).enter().append("path");

        const outerSlice = pie
            .selectAll().data(this.data.pie).enter().append("path");

        const text = pie
            .selectAll().data(this.data.pie).enter().append("text");

        return {
            pie,
            innerSlice,
            topSlice,
            outerSlice,
            text,
        }
    }

    // @param x center x
    // @param y center y
    // @param rx radius x
    // @param ry radius y
    // @param h height x
    // @param ir inner radius x
    drawPie(x: number, y: number, rx: number, ry: number, h: number, ir: number) {
        this.references.pie.attr("transform", "translate(" + x + "," + y + ")");

        this.references.innerSlice
            .style("fill", (d, i) => d3.hsl(this.getColor(i)).darker().toString())
            .attr("d", (d) => this.pieInner(d, rx+0.5,ry+0.5, h, ir));

        this.references.topSlice
            .style("fill", (d, i) => this.getColor(i))
            // .style("stroke", 'blue')
            .attr("d",(d) => this.pieTop(d, rx, ry, ir));

        this.references.outerSlice
            .style("fill", (d, i) => d3.hsl(this.getColor(i)).darker().toString())
            .attr("d",(d) => this.pieOuter(d, rx-.5,ry-.5, h));
            // .each(function(d){this._current=d;});

        this.references.text
            .attr("x",(d) => 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle)))
            .attr("y",(d) => 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle)))
            .style('fill', 'white')
            .text(d => d.data.title);

    }

    pieTop(d: d3.PieArcDatum<ArcData>, rx: number, ry: number, ir: number){
        if(d.endAngle - d.startAngle === 0 ) return "M 0 0";
        const sx = rx*Math.cos(d.startAngle),
            sy = ry*Math.sin(d.startAngle),
            ex = rx*Math.cos(d.endAngle),
            ey = ry*Math.sin(d.endAngle);

        const ret =[];
        ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
        ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
        return ret.join(" ");
    }

    pieOuter(d: d3.PieArcDatum<ArcData>, rx: number, ry: number, h: number){
        const startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        const endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

        const sx = rx*Math.cos(startAngle),
            sy = ry*Math.sin(startAngle),
            ex = rx*Math.cos(endAngle),
            ey = ry*Math.sin(endAngle);

        const ret =[];
        ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
        return ret.join(" ");
    }

    pieInner(d: d3.PieArcDatum<ArcData>, rx: number, ry: number, h: number, ir: number){
        const startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        const endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        const sx = ir*rx*Math.cos(startAngle),
            sy = ir*ry*Math.sin(startAngle),
            ex = ir*rx*Math.cos(endAngle),
            ey = ir*ry*Math.sin(endAngle);

        const ret =[];
        ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
        return ret.join(" ");
    }

    getPieData(data: BarChartData) {
        const _data =d3.pie<ArcData>()
            .value((d) => d.value)
        (data);
        console.log(_data);
        return _data
    }

    styleSvg() {
        this.svg
            .attr("width", this.width)
            .attr("height", this.height);
    }

    main() {
        this.styleSvg();
        this.drawPie(this.width / 2, this.height / 2, this.width / 2 * 0.8, this.width / 2 * 0.8 * 0.6, 50, 0.4);
    }
}

export default BarChartD3