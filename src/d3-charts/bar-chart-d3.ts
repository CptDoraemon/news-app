import * as d3 from "d3";

type BarChartData = ArcData[];

type ArcData = {
    title: string,
    value: number
}

class BarChartD3 {

    readonly getColor = (index: number) => {
        const colors = ['#003f5c', '#374c80', '#7a5195' ,'#bc5090' ,'#ef5675' ,'#ff764a' ,'#ffa600'];
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
        pieZero: d3.PieArcDatum<ArcData>[],
        pie: d3.PieArcDatum<ArcData>[],
    };

    constructor(id: string, data: BarChartData, width: number) {
        this.id = id;
        this.width = width;
        this.height = this.width * 0.6;
        this.svg = d3.select(`#${id}`).append("svg");
        this.data = {
            pieZero: this.getPieData(data.map(_=>({
                value: 0,
                title: _.title
            }))),
            pie: this.getPieData(data)
        };
        this.references = this.createReferences();
    }

    getPieData(data: BarChartData) {
        const _data =d3.pie<ArcData>()
            .value((d) => d.value)
            (data);
        console.log(_data);
        return _data
    }

    createReferences() {
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
            .style("fill", (d, i) => d3.hsl(this.getColor(i)).darker().toString());

        this.references.topSlice
            .style("fill", (d, i) => this.getColor(i));

        this.references.outerSlice
            .style("fill", (d, i) => d3.hsl(this.getColor(i)).darker().toString());

        this.references.text
            .attr("x",'0')
            .attr("y",'0')
            .style('fill', 'white')
            .text(d => d.data.title.toUpperCase());

    }

    pieTransition(rx: number, ry: number, h: number, ir: number, initData: d3.PieArcDatum<ArcData>[], targetData: d3.PieArcDatum<ArcData>[]) {
        const thisClass = this;
        const duration = 5000;
        const raiseDuration = 2000;

        const iRaise = d3.interpolate(0, h);

        function arcTweenInner(d: d3.PieArcDatum<ArcData>) {
            return (t: number) => thisClass.pieInner(d, rx+0.5, ry+0.5, iRaise(t), ir);
        }
        function arcTweenTop(d: d3.PieArcDatum<ArcData>) {
            const i = d3.interpolate(initData.filter(obj => obj.index === d.index)[0], targetData.filter(obj => obj.index === d.index)[0]);
            return (t: number) => thisClass.pieTop(i(t), rx, ry, ir);
        }
        function arcTweenOuter(d: d3.PieArcDatum<ArcData>) {
            return (t: number) => thisClass.pieOuter(d, rx-.5, ry-.5, iRaise(t));
        }
        function textTweenX(d: d3.PieArcDatum<ArcData>) {
            const i = d3.interpolate(initData.filter(obj => obj.index === d.index)[0], targetData.filter(obj => obj.index === d.index)[0]);
            return (t: number) => `${0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle))}`;
        }
        function textTweenY(d: d3.PieArcDatum<ArcData>) {
            const i = d3.interpolate(initData.filter(obj => obj.index === d.index)[0], targetData.filter(obj => obj.index === d.index)[0]);
            return (t: number) => `${0.6*ry*Math.sin(0.5*(i(t).startAngle+i(t).endAngle))}`;
        }


        this.references.innerSlice
            .transition()
            .duration(raiseDuration)
            .delay(duration)
            .attrTween('d', arcTweenInner);
        this.references.topSlice
            .transition()
            .duration(duration)
            .attrTween('d', arcTweenTop);
        this.references.outerSlice
            .transition()
            .duration(raiseDuration)
            .delay(duration)
            .attrTween('d', arcTweenOuter);
        this.references.text
            .transition()
            .duration(duration)
            .attrTween('x', textTweenX)
            .attrTween('y', textTweenY);
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

    styleSvg() {
        this.svg
            .attr("width", this.width)
            .attr("height", this.height);
    }

    main() {
        const rx = this.width / 2 * 0.8;
        const ry = this.height / 2 - 0.1 * this.height;
        const h = 0.1 * this.height;
        const ir = 0.4;

        this.styleSvg();
        this.drawPie(this.width / 2, this.height / 2, rx, ry, h, ir);
        this.pieTransition(rx, ry, h, ir, this.data.pieZero, this.data.pie);
    }
}

export default BarChartD3