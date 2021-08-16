import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { setName, setDriveId } from './graphSlice'

interface DriveState {
  isSignedIn: boolean
  recentlySaved: boolean
}

const initialState: DriveState = {
  isSignedIn: false,
  recentlySaved: false,
}

const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    setSignedIn: {
      reducer(state, action) {
        state.isSignedIn = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
    setSaved: {
      reducer(state, action) {
        state.recentlySaved = action.payload
      },
      prepare(data: any) { return { id: nanoid(), payload: data } as any },
    },
  },
})

export const {
  setSignedIn,
  setSaved,
} = driveSlice.actions
export const login = () => async (dispatch: any) => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          // this should not be hardcoded!
          'apiKey': 'AIzaSyCLb1u522GN_FZMEyVtWWyeAcAnrCBZOek',
          'clientId': '1005163744705-p4784hs6t18al7seej1e1oh4bsfqscej.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive.appdata',
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        })

        const status = gapi.auth2.getAuthInstance().isSignedIn.get()
        if (!status) {
          gapi.auth2.getAuthInstance().isSignedIn.listen((status: boolean) => {
            resolve(dispatch(setSignedIn(status)))
          })
          await gapi.auth2.getAuthInstance().signIn()
        } else {
          resolve(dispatch(setSignedIn(status)))
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  })
}

export const saveToDrive = () => async (dispatch: any, getState: any) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const graph = getState().graph
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
      dispatch(setSaved(true))
    })()
  })
}

export default driveSlice.reducer
