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
} from 'reactflow';
import 'reactflow/dist/style.css';

const elk = new ELK();
const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
};
const position = { x: 0, y: 0 };

const getLayoutedElements = (nodes, edges, options = {}) => {
    const graph = {
      id: 'root',
      layoutOptions: options,
      children: nodes.map((node) => ({
        ...node,
        // Adjust the target and source handle positions based on the layout
        // direction.
        targetPosition: 'top',
        sourcePosition: 'bottom',
  
        // Hardcode a width and height for elk to use when layouting.
        width: 150,
        height: 50,
      })),
      edges: edges,
    };
  
    return elk
      .layout(graph)
      .then((layoutedGraph) => ({
        nodes: layoutedGraph.children.map((node) => ({
          ...node,
          // React Flow expects a position property on the node instead of `x`
          // and `y` fields.
          position: { x: node.x, y: node.y },
        })),
  
        edges: layoutedGraph.edges,
      }))
      .catch(console.error);
  };

function TreeViz() {
    const [treeData, setTreeData] = React.useState({ nodes: [], edges: [] });
    const supabase = createSupabaseClient();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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
        [nodes, edges, treeData]
    );

    // Calculate the initial layout on mount.
    React.useLayoutEffect(() => {
        onLayout({ direction: 'DOWN', useInitialNodes: true });
    }, []);

    React.useEffect(() => {
        console.log('Retrigger')
        onLayout({ direction: 'DOWN', useInitialNodes: true });
    }, [treeData]);

    React.useEffect(() => {
        async function fetchUsers() {
            let users = (await supabase.from('users').select('id, name, big')).data;

            if (users) {
                let _userNodes = [];
                let _userEdges = [];
                for (let user of users) {
                    _userNodes.push({ id: `${user.id}`, position, data: { label: user.name } });
                    if (user.big) {
                        _userEdges.push({ id: `e${user.big}-${user.id}`, source: `${user.big}`, target: `${user.id}` });
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
            proOptions={{ hideAttribution: true }}
            fitView
            minZoom={0.25}
        />
    )
}

export default function MyFamilyPage() {

    return (
        <div className="flex flex-col">
            <div style={{width: "100vw", height: "100vh"}}>
                <ReactFlowProvider>
                    <TreeViz />
                </ReactFlowProvider>
            </div>
        </div>
    )
}