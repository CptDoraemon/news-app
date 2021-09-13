import * as d3 from "d3";
import d3Cloud from "d3-cloud";

export type WordCloudData = Array<{
  count: number,
  word: string
}>

class WordCloudD3 {
  colors = ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600'];
  id: string;
  data: {
    data: WordCloudData,
    words: string[],
    counts: number[],
    maxCount: number
  };
  params: {
    width: number,
    height: number
  };
  scale: d3.ScaleLinear<number, number>;

  constructor(data: WordCloudData, id: string) {
    this.id = id;
    this.data = this.getData(data);
    const containerEl = document.getElementById(id);
    this.params = {
      width: containerEl ? containerEl.getBoundingClientRect().width : 0,
      height: containerEl ? containerEl.getBoundingClientRect().height : 0,
    };
    this.scale = this.getScale();
    this.styleSvg = this.styleSvg.bind(this);
  }

  getData(data: WordCloudData) {
    const counts = data.map(obj => obj.count);
    return {
      data,
      words: data.map(obj => obj.word),
      counts,
      maxCount: Math.max.apply(Math, counts)
    }
  }

  getScale() {
    return d3.scaleLinear()
      .domain([0, this.data.maxCount])
      .range([10, this.params.width / 5]);
  }

  draw() {
    d3Cloud<{
      text: string,
      size: number
    }>().size([this.params.width, this.params.height])
      .timeInterval(20)
      .words(this.data.data.map((d) => ({
        text: d.word,
        size: this.scale(d.count)
      })))
      .fontSize((d: any) => d.size)
      .font('MierB')
      .fontWeight(900)
      .padding(1)
      // .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
      .on("end", this.styleSvg)
      .start();
  }

  styleSvg(words: any) {
    d3.select(`#${this.id}`).append("svg")
      .attr("width", this.params.width)
      .attr("height", this.params.height)
      .append("g")
      .attr("transform", "translate(" + [this.params.width >> 1, this.params.height >> 1] + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", (d: any) => {
        return d.size + "px"
      })
      .style("font-family", "MierB")
      .style("font-weight", "900")
      .style("fill", () => this.colors[Math.floor(Math.random() * this.colors.length)])
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d: any) {
        return d.text;
      });
  }

  main() {
    this.draw();
  }
}

export default WordCloudD3
