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

const getLayoutedElements = (nodes, edges, options = {}) => {
    // Sort nodes by their family property
    const sortedNodes = [...nodes].sort((a, b) => a.data.family - b.data.family);

    const graph = {
        id: 'root',
        layoutOptions: options,
        children: sortedNodes.map((node) => ({
            ...node,
            targetPosition: 'top',
            sourcePosition: 'bottom',
            width: 200,
            height: 100,
        })),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                position: { x: node.x, y: node.y },
            })),
            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};

function CustomNode({ data }) {
    const inactiveColors =
    [
        "blue-100","blue-100","blue-100"
    ]
    const colors =
    [
        "red-300","purple-300","blue-300"
    ]
    console.log(data)
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

const nodeTypes = { custom: CustomNode };
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
            console.log(treeData.nodes);
            console.log(treeData.edges);

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
            let users = (await supabase.from('family_tree').select('id, name, big, class(*), family, auth_id')).data;
    
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
            minZoom={0.25}
            className="bg-teal-50"
        />
    )
}

export default function MyFamilyPage() {
    return (
        <div className="flex flex-col">
            <div style={{ width: "100vw", height: "100vh" }}>
                <ReactFlowProvider>
                    <TreeViz />
                </ReactFlowProvider>
            </div>
        </div>
    )
}