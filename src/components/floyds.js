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