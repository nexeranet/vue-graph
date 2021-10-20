function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function generateData(num){
  let nodes = [], links = [];
  for(let i = 0; i < num; i++) {
    nodes.push({
      id: i,
      name: i,
      weight: randomIntFromInterval(10, num + 10)
    })
  }
  for (let node of nodes) {
      let num_of_links = randomIntFromInterval(1, 4)
      for(let i = 0; i < num_of_links; i ++){
        links.push({
          source: node.id,
          target: randomIntFromInterval(0, nodes.length - 1),
          value: randomIntFromInterval(0, num),
          stroke: "lightblue",
        })
      }
  }
  return {
    nodes: nodes,
    links: links,
  }
}
const data =  generateData(50);
export default data; 