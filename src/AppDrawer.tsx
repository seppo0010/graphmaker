import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PublishIcon from '@material-ui/icons/Publish';
import ShareIcon from '@material-ui/icons/Share';
// import ImageIcon from '@material-ui/icons/Image';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import dotparse, { NodeStatement, EdgeStatement } from 'dotparser'

import LoadFromDrive from './LoadFromDrive'
import { Node, Edge, setGraph, setName, setDriveId } from './graphSlice'
import { login } from './driveSlice'
import { setDrawerIsOpen } from './navigationSlice'
import type { RootState } from './store'

function AppDrawer() {
  const dispatch = useDispatch()
  const graph = useSelector((state: RootState) => state.graph)
  const drawerIsOpen = useSelector((state: RootState) => state.navigation.drawerIsOpen)
  const [loadFromDriveOpen, setLoadFromDriveOpen] = useState(false)

  const uploadDOT = () => {
    const element = document.createElement('input');
    element.setAttribute('type', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    element.onchange = () => {
      const fileToLoad = element.files![0];

      const getAttribute = (name: string, attrs: {id: string, eq: string}[]) => {
        return attrs.find((a) => a.id === name)?.eq
      }
      const fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent){
        const textFromFileLoaded = fileLoadedEvent.target!.result;
        const st = dotparse(textFromFileLoaded as string)
        const nodes = st[0].children
            .filter((s) => s.type === 'node_stmt')
            .map((n: NodeStatement | EdgeStatement, i) => n as NodeStatement)
            .map((n: NodeStatement, i) => ({
          id: i + 1,
          label: n.node_id.id,
          color: getAttribute('color', n.attr_list),
          shape: getAttribute('shape', n.attr_list),
        }))
        const nodesByLabel = Object.fromEntries(nodes.map((n) => [n.label, n]))
        const edges = st[0].children
            .filter((s) => s.type === 'edge_stmt')
            .map((n: NodeStatement | EdgeStatement, i) => n as EdgeStatement)
            .map((n: EdgeStatement, i) => ({
          id: i + 1,
          from: nodesByLabel[n.edge_list[0].id].id,
          to: nodesByLabel[n.edge_list[1].id].id,
          color: getAttribute('color', n.attr_list),
        }))
        const graph = {
          nodes,
          edges,
        }
        dispatch(setGraph(graph))
      };

      fileReader.readAsText(fileToLoad, "UTF-8");
    }
  }

  const downloadAsDOT = () => {
    const nodes = Object.fromEntries(graph.nodes.map((node: Node) => [node.id, node]))
    let text = 'digraph {\n'
    text += graph.nodes.map((n: Node) => `  "${n.label}"[shape=${n.shape}][color=${n.color}]`).join('\n') + '\n'
    text += graph.edges.map((e: Edge) => `  "${nodes[e.from].label}"->"${nodes[e.to].label}"[color=${e.color}]`).join('\n') + '\n'
    text += '}'
    const filename = 'graph.dot'
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /* TODO
  const downloadAsPNG = () => {
    const dt = visJsRef?.current?.getElementsByTagName('canvas')[0]
    if (!dt) return
    const href = dt.toDataURL().replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const filename = 'graph.png'
    const element = document.createElement('a');
    element.setAttribute('href', href)
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  */

  const saveToDrive = async () => {
    let name;
    if (graph.name) {
      name = graph.name
    } else {
      name = prompt('name?')
      await dispatch(setName(name))
    }
    try {
      await dispatch(login());
    } catch (e) {
      // FIXME: setError...
      alert(e.details || e.error)
      return
    }

    let driveId = graph.driveId
    if (!driveId) {
      const response = await (gapi.client.drive as any).files.create({
        parents: ['appDataFolder'],
        'content-type': 'application/json',
        uploadType: 'multipart',
        name: name,
        mimeType: 'application/json',
        fields: 'id, name, kind, size'
      })
      await dispatch(setDriveId(response.result.id))
      driveId = response.result.id
    }

    const g = {
      name: name || '',
      edges: graph.edges,
      nodes: graph.nodes,
      driveId: driveId,
      text: graph.text,
    }
    const body = JSON.stringify({graph: g});
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${driveId}`, {
     method: 'PATCH',
     headers: new Headers({
       'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
       'Content-Type': 'application/json'
     }),
     body,
    })
  }

  return (
    <Drawer
      open={drawerIsOpen}
      >
      <div>
        <IconButton onClick={() => dispatch(setDrawerIsOpen(false))}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button style={{paddingRight: 100}} onClick={saveToDrive}>
          <ListItemIcon><CloudUploadIcon /></ListItemIcon>
          <ListItemText primary="Save to Drive" />
        </ListItem>
        <ListItem button style={{paddingRight: 100}} onClick={() => setLoadFromDriveOpen(true)}>
          <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
          <ListItemText primary="Load from Drive" />
        </ListItem>
        <ListItem button style={{paddingRight: 100}} onClick={uploadDOT}>
          <ListItemIcon><PublishIcon /></ListItemIcon>
          <ListItemText primary="Upload DOT" />
        </ListItem>
        <ListItem button style={{paddingRight: 100}} onClick={downloadAsDOT}>
          <ListItemIcon><ShareIcon /></ListItemIcon>
          <ListItemText primary="Download as DOT" />
        </ListItem>
        {/*
        <ListItem button style={{paddingRight: 100}}>
          <ListItemIcon><ImageIcon /></ListItemIcon>
          <ListItemText primary="Download as PNG" />
        </ListItem>
        */}
      </List>
      {loadFromDriveOpen && <LoadFromDrive
        close={() => setLoadFromDriveOpen(false)}
        />}
    </Drawer>
  )
}

export default AppDrawer
