function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function createNode(length) {
  let Node = {
    id: String(length),
    name: String(length),
    links: [],
    weight: randomIntFromInterval(10, 30)
  };
  let links = [];
  let num_of_links = randomIntFromInterval(1, 4);
  for (let i = 0; i < num_of_links; i++) {
    const target = randomIntFromInterval(0, length);
    const link = {
      source: Node.id,
      target: target == Node.id ? '0' : String(target),
      value: randomIntFromInterval(0, 50),
      stroke: "lightblue",
      isResult: false,
    };
    links.push(link)
    Node.links.push(link)
  }
  return [Node, links]
}

export function generateData(num = 10) {
  let nodes = [],
    links = [];
  const inf = Number.POSITIVE_INFINITY;
  const matrix = (function () {
    const arr = new Array(num).fill(inf);
    return arr.map(() => new Array(num).fill(inf))
  })()
  for (let key_n in matrix) {
    let num_of_links = randomIntFromInterval(1, 5)

    for (let i = 0; i < num_of_links; i++) {
      matrix[key_n][randomIntFromInterval(0, num - 1)] = randomIntFromInterval(1, 50)
    }
    loop: for (let key_l in matrix) {
      const target = matrix[key_n][key_l];
      if (key_n === key_l) {
        matrix[key_n][key_l] = 0;
        continue loop;
      }
      if (!isFinite(target)) {
        continue loop;
      }
      matrix[key_l][key_n] = target;
    }
  }

  for (let key in matrix) {
    const node = {
      id: key,
      name: key,
      links: [],
      weight: randomIntFromInterval(10, 30)
    };
    loop: for (let [l_key, value] of Object.entries(matrix[key])) {
      if (!isFinite(value) || value === 0) {
        continue loop;
      }
      const link = {
        source: key,
        target: l_key,
        value: value,
        isResult: false,
        stroke: "lightblue",
      };
      node.links.push(link);
      links.push(link);
    }
    nodes.push(node)
  }

  return {
    nodes: nodes,
    links: links,
  }
}