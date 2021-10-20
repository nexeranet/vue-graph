function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function createNode(length) {
  let Node = {
    id: length,
    name: length,
    weight: randomIntFromInterval(10, 30)
  };
  let links = [];
  let num_of_links = randomIntFromInterval(1, 4);
  for (let i = 0; i < num_of_links; i++) {
    links.push({
      source: Node.id,
      target: randomIntFromInterval(0, length) == Node.id ? 0 : randomIntFromInterval(0, length - 1),
      value: randomIntFromInterval(0, 50),
      stroke: "lightblue",
    })
  }
  return [Node, links]
}

export function generateData(num) {
  let nodes = [],
    links = [];
  for (let i = 0; i < num; i++) {
    nodes.push({
      id: i,
      name: i,
      weight: randomIntFromInterval(10, 30)
    })
  }
  for (let node of nodes) {
    let num_of_links = randomIntFromInterval(1, 4)
    for (let i = 0; i < num_of_links; i++) {
      links.push({
        source: node.id,
        target: randomIntFromInterval(0, nodes.length - 1) == node.id ? 0 : randomIntFromInterval(0, nodes.length - 1),
        value: randomIntFromInterval(0, 50),
        stroke: "lightblue",
      })
    }
  }

  return {
    nodes: nodes,
    links: links,
  }
}