import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

interface DriveState {
  isSignedIn: boolean
}

const initialState: DriveState = {
  isSignedIn: false,
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
  },
})

export const {
  setSignedIn
} = driveSlice.actions
export const login = () => async (dispatch: any) => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
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
        gapi.auth2.getAuthInstance().signIn()
      } else {
        resolve(dispatch(setSignedIn(status)))
      }
    })
  })
}

export default driveSlice.reducer
