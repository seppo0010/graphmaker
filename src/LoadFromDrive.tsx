import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { setGraph, setName, setDriveId } from './graphSlice'
import { login } from './driveSlice'

export default function LoadFromDrive({close}: {close: () => void}) {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<{id: string, name: string}[]>([])
  const dispatch = useDispatch()
  const handleListItemClick = async ({id, name}: {id: string, name: string}) => {
    const f = await (gapi.client.drive as any).files.get({
      fileId: id,
      alt: 'media',
    });
    await dispatch(setDriveId(id))
    await dispatch(setName(name))
    await dispatch(setGraph(JSON.parse(f.body).graph))
    close()
  };

  useState(() => {
    (async () => {
      await dispatch(login());
      const response = await (gapi.client as any).drive.files.list({
        spaces: 'appDataFolder',
        pageSize: 50,
        fields: "nextPageToken, files(id, name)",
        orderBy: 'modifiedTime desc',
      })
      setLoading(false)
      const f = JSON.parse(response.body).files
      setFiles(f)
    })()
  })

  return (
    <Dialog onClose={close} aria-labelledby="simple-dialog-title" open={true}>
      <DialogTitle id="simple-dialog-title">
        Cargar desde Drive
        <IconButton><CloseIcon onClick={close} /></IconButton>
      </DialogTitle>
      {loading && <div style={{textAlign: 'center'}}><CircularProgress /></div>}
      {!loading && <List>
        {files.map((file) => (
          <ListItem button onClick={() => handleListItemClick(file)} key={file.id}>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>}
    </Dialog>
  );
}
