export function formatData(data) {
    const n_map = new Map();
    for (let node of data.nodes) {
        const links = node.links.map((el) => Number(el.target));
        n_map.set(parseInt(node.id), links)
    }
    return n_map;
}

export function RemovePath(nodes, path) {
    const arr = Array.from(path);
    const next = (key, value) => {
        const node_key = Number(value);
        let target = nodes.get(node_key);
        let source = arr[key + 1];
        target = target.filter((el) => el != source);
        nodes.set(node_key, target);
    }
    const prev = (key, value) => {
        const node_key = Number(value);
        let target = nodes.get(node_key);
        let source = arr[key - 1];
        target = target.filter((el) => el != source);
        nodes.set(node_key, target);
    }
    for (let [key, value] of Object.entries(arr)) {
        key = Number(key);
        value = Number(value);
        if (key == 0) {
            next(key, value);
            continue;
        }
        if (key == path.size - 1) {
            prev(key, value);
            continue;
        }
        prev(key, value);
        next(key, value);
    }
    return nodes;
}
export function CreateDFS(nodes = new Map(), end) {
    const find = function (start, visited = new Set()) {
        visited.add(start);
        const destinations = nodes.get(Number(start));
        for (const destination of destinations) {
            const dis = Number(destination);
            if (dis === end) {
                visited.add(end)
                return visited;
            }

            if (!visited.has(dis)) {
                return find(dis, visited);
            }

        }
        return false;
    }
    return find;
}

export function CreateBFS(nodes = new Map(), end) {
    const bfs = function (start) {
        const visited = new Set();
        const queue = [start]
        while (queue.length > 0) {
            const node = queue.shift();
            const destinations = nodes.get(node);
            for (const destination of destinations) {
                if (destination === end) {
                    console.log(`BFS found Bangkok!`, destinations)
                }
                if (!visited.has(destination)) {
                    visited.add(destination);
                    queue.push(destination);
                }
            }
        }
        return visited;
    }
    return bfs;
}

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}
export function CalcValues(nodes, paths) {
    var results = [];
    console.log(paths);
    for (let path of paths) {
        const path_array = Array.from(path);
        let sum = 0;
        let steps = [];
        Loop: for (let [key, step] of Object.entries(path_array)) {
            key = Number(key);
            if (key === path_array.length - 1) {
                break Loop;
            }
            const node = nodes[step];
            const target = node.links.find((e) => e.target == path_array[Number(key) + 1]);
            if (target) {
                sum += target.value;
                target.isResult = true;
                steps.push(copyObject(target));
            }
        }
        results.push({
            steps: steps,
            path: path,
            sum: sum
        })
    }
    return results.sort((a, b) => a.sum - b.sum);
}