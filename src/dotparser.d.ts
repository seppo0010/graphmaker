declare module 'dotparser' {
  export type Statement = NodeStatement | EdgeStatement;

  export interface NodeStatement {
    type: 'node_stmt'
    node_id: {
      type: 'node_id'
      id: string
    }
    attr_list: {
      type: 'attr'
      id: string
      eq: string
    }[]
  }

  export interface EdgeStatement {
    type: 'edge_stmt'
    edge_list: {
      type: 'node_id'
      id: string
    }[]
    attr_list: {
      type: 'attr'
      id: string
      eq: string
    }[]
  }

  export interface Graph {
    type: string
    children: Statement[]
  }
  export default function parse(text: string): Graph[];
}
