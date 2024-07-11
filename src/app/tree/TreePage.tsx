'use client'

import { createClient } from '@/utils/supabase/client';
import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useLayoutEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow';
 
import 'reactflow/dist/style.css';

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'mrtree',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

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

const position = { x: 0, y: 0 };

const initialNodes = [
  { id: '1', position, data: { label: 'Joseph Ramirez' } },
  { id: '2', position, data: { label: 'Lucy Mid' } },
  { id: '3', position, data: { label: 'Anderson Truong' } },
  { id: '4', position, data: { label: 'Vivian Lu' } },
  { id: '5', position, data: { label: 'Isabel Jennings' } },
  { id: '6', position, data: { label: 'Thomas Ho' } },
  { id: '7', position, data: { label: 'Midchelle Lim' } },
  { id: '8', position, data: { label: 'William Park' } },
  { id: '9', position, data: { label: 'Skylar Lo' } },
];
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-5', source: '2', target: '5' },
    { id: 'e2-6', source: '2', target: '6' },
    { id: 'e3-7', source: '3', target: '7' },
    { id: 'e4-8', source: '4', target: '8' },
    { id: 'e6-9', source: '6', target: '9' },
];

function TreeViz() {
    const [treeData, setTreeData] = React.useState({ nodes: [], edges: [] });
    const supabase = createClient();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
    const onLayout = useCallback(
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
    useLayoutEffect(() => {
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
        />
    )
}

export default function TreePage() {
    return (
        <div className="flex flex-col items-center w-full">
            <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlowProvider>
                <TreeViz />
            </ReactFlowProvider>
            </div>
        </div>
    )
}