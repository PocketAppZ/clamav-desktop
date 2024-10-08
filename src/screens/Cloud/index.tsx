import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { useCallback, useEffect, useRef } from 'react'

import styled from 'styled-components'
import { Button } from '../../elements/Button'
import { Logger } from '../../elements/Logger'
import { useCachedState } from '../../hooks/useCachedState'
import { Screen } from '../../layouts/Screen'
import { Core, Webview } from '../../types'

export function Cloud() {
  const timerRef = useRef<number | undefined>(undefined)

  const [state, setState] = useCachedState<Core.CloudState | undefined>(Webview.CacheKey.CLOUD_STATE, undefined)

  const isLoading = !state
  const logsAsString = (state?.logs || []).join('\n')

  const startCloudDaemon = useCallback(() => {
    invoke('start_cloud_daemon')
  }, [])

  const startCloudUpdate = useCallback(() => {
    invoke('start_cloud_update')
  }, [])

  const stopCloudDaemon = useCallback(() => {
    invoke('stop_cloud_daemon')
  }, [])

  useEffect(() => {
    invoke('get_cloud_state')

    listen<Core.CloudState>('cloud:state', event => {
      setState(event.payload)
    })

    timerRef.current = window.setInterval(() => {
      invoke('get_cloud_state')
    }, 50000)

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [setState])

  return (
    <Screen isLoading={isLoading}>
      <Logger hasForcedScroll>{logsAsString}</Logger>

      <ActionsBox>
        {!!state && state.status === Core.CloudDaemonStatus.RUNNING && (
          <>
            <Button data-testid="cloud__button" onClick={stopCloudDaemon} style={{ marginTop: 16 }}>
              Stop Cloud Daemon
            </Button>
          </>
        )}
        {!!state && state.status === Core.CloudDaemonStatus.STOPPED && (
          <Button data-testid="cloud__button" onClick={startCloudDaemon} style={{ marginTop: 16 }}>
            Start Cloud Daemon
          </Button>
        )}
        {!!state && state.status === Core.CloudDaemonStatus.UNKNOWN && (
          <Button data-testid="cloud__button" disabled style={{ marginTop: 16 }}>
            Loading...
          </Button>
        )}
        {!!state && state.is_running ? (
          <Button data-testid="cloud__button" disabled style={{ marginTop: 16 }}>
            Updating Virus Database...
          </Button>
        ) : (
          <Button
            data-testid="cloud__button"
            disabled={!state || state.status !== Core.CloudDaemonStatus.STOPPED}
            onClick={startCloudUpdate}
            style={{ marginTop: 16 }}
          >
            {state?.status === Core.CloudDaemonStatus.STOPPED
              ? 'Update Virus Database'
              : 'Stop the Cloud Daemon first if you want to update manually'}
          </Button>
        )}
      </ActionsBox>
    </Screen>
  )
}

const ActionsBox = styled.div`
  display: flex;
  gap: 16px;

  > button {
    flex: 0.5;
  }
`
