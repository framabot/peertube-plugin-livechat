import type { LiveChatJSONLDAttributeV1 } from './types'

interface AnonymousConnectionInfos {
  roomJID: string
  boshUri?: string
  wsUri?: string
  userJID: string
}

function anonymousConnectionInfos (livechatInfos: LiveChatJSONLDAttributeV1 | false): AnonymousConnectionInfos | null {
  if (!livechatInfos) { return null }
  if (livechatInfos.type !== 'xmpp') { return null }
  if (!livechatInfos.xmppserver) { return null }
  if (!livechatInfos.xmppserver.anonymous) { return null }
  const r: AnonymousConnectionInfos = {
    roomJID: livechatInfos.jid,
    userJID: livechatInfos.xmppserver.anonymous.virtualhost
  }
  if (livechatInfos.xmppserver.anonymous.bosh) {
    r.boshUri = livechatInfos.xmppserver.anonymous.bosh
  }
  if (livechatInfos.xmppserver.anonymous.websocket) {
    r.wsUri = livechatInfos.xmppserver.anonymous.websocket
  }

  if (!r.boshUri && !r.wsUri) {
    return null
  }

  return r
}

function remoteAuthenticatedConnectionEnabled (livechatInfos: LiveChatJSONLDAttributeV1): boolean {
  if (!livechatInfos) { return false }
  if (livechatInfos.type !== 'xmpp') { return false }
  if (!('xmppserver' in livechatInfos)) { return false }
  if (!livechatInfos.xmppserver) { return false }

  if (livechatInfos.xmppserver.websockets2s) { return true }
  if (livechatInfos.xmppserver.directs2s) { return true }

  return false
}

function compatibleRemoteAuthenticatedConnectionEnabled (
  livechatInfos: LiveChatJSONLDAttributeV1,
  canWebsocketS2S: boolean,
  canDirectS2S: boolean
): boolean {
  if (!livechatInfos) { return false }
  if (livechatInfos.type !== 'xmpp') { return false }
  if (!('xmppserver' in livechatInfos)) { return false }
  if (!livechatInfos.xmppserver) { return false }

  // FIXME: these tests does not really represent what Prosody will do.
  // Prosody can use Websocket in one way and Direct S2S in the other.
  // I don't really know what to test here.
  // In real case scenario, we should always have Websocket S2S on both side...
  // They are rare cases where Websocket is disabled on an entire server.
  // In such case, we indeed need direct S2S on both side.
  // So these tests should work.
  if (canWebsocketS2S && livechatInfos.xmppserver.websockets2s) { return true }
  if (canDirectS2S && livechatInfos.xmppserver.directs2s) { return true }

  return false
}

export {
  anonymousConnectionInfos,
  remoteAuthenticatedConnectionEnabled,
  compatibleRemoteAuthenticatedConnectionEnabled
}
