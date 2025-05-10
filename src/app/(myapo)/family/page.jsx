'use client'

import { createSupabaseClient } from '@/supabase/client';
import ELK from 'elkjs/lib/elk.bundled.js';
import React from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const elk = new ELK();
const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '100',
};
const position = { x: 0, y: 0 };
const familyNames = ["Alpha", "Phi", "Omega"]

const layoutLineGroupsInFamily = (lineGroups, maxRowWidth = 800, padding = 20, gap = 40) => {
    let x = padding;
    let y = padding;
    let rowHeight = 0;

    lineGroups.forEach(group => {
        const groupWidth = group.style.width;
        const groupHeight = group.style.height;

        // Wrap to new row if next group would exceed max width
        if (x + groupWidth + padding > maxRowWidth) {
            x = padding;
            y += rowHeight + gap;
            rowHeight = 0;
        }

        group.position = { x, y };
        x += groupWidth + gap;
        rowHeight = Math.max(rowHeight, groupHeight);
    });

    // Return bounding box to adjust family group size later
    return {
        width: maxRowWidth,
        height: y + rowHeight + padding,
    };
};

const getLayoutedElements = async (nodes, edges, options = {}) => {
    const families = [...new Set(nodes.map(n => n.data.family))].sort((a, b) => a - b);
    let allNodes = [];
    let allEdges = [];
    let xOffset = 0;

    for (const family of families) {
        const familyId = `family-${family}`;
        const familyNodes = nodes.filter(n => n.data.family === family);
        const familyNodeIds = new Set(familyNodes.map(n => n.id));
        const familyEdges = edges.filter(e => familyNodeIds.has(e.source) && familyNodeIds.has(e.target));

        // Build adjacency and reverse adjacency
        const childMap = {};
        const parentCount = {};
        for (const node of familyNodes) {
            childMap[node.id] = [];
            parentCount[node.id] = 0;
        }
        for (const edge of familyEdges) {
            childMap[edge.source].push(edge.target);
            parentCount[edge.target]++;
        }

        // Find root nodes in this family (no parents)
        const rootIds = Object.keys(parentCount).filter(id => parentCount[id] === 0);

        let lineGroups = [];
        let subtreeNodes = [];
        let subtreeEdges = [];

        for (const rootId of rootIds) {
            const visited = new Set();
            const queue = [rootId];
            while (queue.length) {
                const current = queue.shift();
                if (visited.has(current)) continue;
                visited.add(current);
                queue.push(...childMap[current]);
            }

            const lineNodeSet = new Set(visited);
            let lineName = "";
            familyNodes.filter(n => lineNodeSet.has(n.id))
                .forEach(x => { if (x.data.line != null) lineName = x.data.line });

            const lineNodes = familyNodes
                .filter(n => lineNodeSet.has(n.id))
                .map(n => ({
                    ...n,
                    width: 200,
                    height: 100,
                    targetPosition: 'top',
                    sourcePosition: 'bottom',
                }));
            // console.log(lineNodes);
            const lineEdges = familyEdges.filter(e => lineNodeSet.has(e.source) && lineNodeSet.has(e.target));

            const layout = await elk.layout({
                id: `line-${rootId}`,
                layoutOptions: options,
                children: lineNodes,
                edges: lineEdges,
            });

            const minX = Math.min(...layout.children.map(n => n.x));
            const minY = Math.min(...layout.children.map(n => n.y));
            const maxX = Math.max(...layout.children.map(n => n.x + n.width));
            const maxY = Math.max(...layout.children.map(n => n.y + n.height));
            const width = Math.max(maxX - minX + 80, 600);
            const height = maxY - minY + 40;

            const lineGroupId = `line-${rootId}`;
            lineGroups.push({
                id: lineGroupId,
                position: { x: 0, y: 0 },
                data: { label: lineName },
                style: {
                    width,
                    height,
                    border: '2px solid #555',
                    zIndex: 0,
                },
                draggable: false,
                selectable: false,
                type: 'line',
                parentNode: familyId,
            });

            layout.children.forEach(node => {
                subtreeNodes.push({
                    ...node,
                    position: {
                        x: node.x - minX + 20,
                        y: node.y - minY + 20,
                    },
                    parentNode: lineGroupId,
                    extent: 'parent',
                });
            });

            subtreeEdges.push(...layout.edges);
        }

        // Layout line groups within family group manually (horizontal layout)
        let yInnerOffset = 200;
        const maxWidth = 5000;
        let currentX = 0;
        let maxUsed = 0;
        let maxY = 0;
        const padding = 20;

        lineGroups = lineGroups.sort((a, b) => b.style.height - a.style.height)

        lineGroups.forEach(group => {
            /// console.log(group.id + " " + group.style.width)
            if(currentX != 0 && currentX + group.style.width + padding > maxWidth)
            {
                currentX = 0;
                yInnerOffset += maxY + 2 * padding;
                maxY = 0;
            }
            group.position.x = currentX + padding;
            group.position.y = yInnerOffset;
            maxY = Math.max(maxY, group.style.height)

            currentX += padding + group.style.width;
            maxUsed = Math.max(maxUsed, currentX);
        });

        // update family group size accordingly
        const familyWidth = maxUsed + 40;
        const familyHeight = yInnerOffset + 20 + maxY;

        allNodes.push({
            id: familyId,
            position: { x: xOffset, y: 0 },
            data: { label: familyNames[family - 1]},
            style: {
                width: familyWidth,
                height: familyHeight,
                zIndex: 0,
            },
            draggable: false,
            selectable: false,
            type:'family'
        });

        allNodes.push(...lineGroups);
        allNodes.push(...subtreeNodes);
        allEdges.push(...subtreeEdges);

        xOffset += familyWidth + 60;
    }

    return { nodes: allNodes, edges: allEdges };
};

function LineNode({ data }) {
    return (
        <div className="p-2 rounded-md">
            <div className="p-4 text-5xl text-right font-bold text-gray-800">{data.label}</div>
            {data.children?.map(childId => (
                <div key={childId} className="hidden">{childId}</div>
            ))}
        </div>
    );
}


function FamilyNode({ data }) {
    return (
        <div className="p-8 border-4 border-gray-500 bg-white shadow-inner rounded-lg">
            <div className="text-8xl font-black text-center text-gray-800">
                {data.label}
            </div>
        </div>
    );
} 

function CustomNode({ data }) {
    const inactiveColors =
    [
        "blue-100","blue-100","blue-100"
    ]
    const colors =
    [
        "red-300","purple-300","blue-300"
    ]
    //console.log(data)
    return (
        <div className={`px-2 py-2 shadow-md rounded-md bg-${data.active ? inactiveColors[data.family - 1] : colors[data.family - 1]} border-2 border-stone-600`}>
            <div className="flex w-[200px]">
                <div className="ml-2">
                    <div className="text-lg text-black font-bold">{data.name}</div>
                    <div className="text-gray-500">{data.class.symbol}</div>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !bg-teal-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-teal-500"
            />
        </div>
    );
}

const nodeTypes = { custom: CustomNode, line: LineNode, family: FamilyNode };
function TreeViz() {
    const [ treeData, setTreeData ] = React.useState({ nodes: [], edges: [] });
    const supabase = createSupabaseClient();

    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const { fitView } = useReactFlow();

    

    const onConnect = React.useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
    const onLayout = React.useCallback(
        ({ direction, useInitialNodes = false }) => {

            console.log('On layout:')
            // console.log(treeData.nodes);
            // console.log(treeData.edges);

            const opts = { 'elk.direction': direction, ...elkOptions };
            const ns = useInitialNodes ? treeData.nodes : nodes;
            const es = useInitialNodes ? treeData.edges : edges;

            getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);

                window.requestAnimationFrame(() => fitView());
            });
        },
        [ nodes, edges, treeData ]
    );

    // Calculate the initial layout on mount.
    React.useLayoutEffect(() => {
        onLayout({ direction: 'DOWN', useInitialNodes: true });
    }, []);

    React.useEffect(() => {
        console.log('Retrigger')
        onLayout({ direction: 'DOWN', useInitialNodes: true });
    }, [ treeData ]);

    React.useEffect(() => {
        async function fetchUsers() {
            let users = (await supabase.from('family_tree').select('id, name, big, class(*), family, auth_id, line')).data;
    
            if (users) {
                let _userNodes = [];
                let _userEdges = [];
                for (let user of users) {
                    user.active = user.auth_id == null;
                    _userNodes.push({ id: `${user.id}`, position, type: 'custom', data: user });
                    if (user.big) {
                        _userEdges.push({ id: `e${user.big}-${user.id}`, source: `${user.big}`, target: `${user.id}`, type: 'smoothstep' });
                    }
                }
    
                setTreeData({ nodes: _userNodes, edges: _userEdges });
            }
        }
        fetchUsers();
    }, []);    

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesConnectable={false}
            proOptions={{ hideAttribution: true }}
            fitView
            nodeTypes={nodeTypes}
            minZoom={0.05}
            className="bg-teal-50"
        />
    )
}

export default function MyFamilyPage() {
    return (
        <div className="flex flex-col">
            <div className='w-[100vw] h-[100vh]'>
                <ReactFlowProvider>
                    <TreeViz />
                </ReactFlowProvider>
            </div>
        </div>
    )
}