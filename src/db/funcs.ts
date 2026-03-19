import { Message, PartialMessage } from 'discord.js'
import { MessageRow } from '~/types'
import { msgDb } from './messages'

const insertMessage = msgDb.prepare(`
  INSERT OR IGNORE INTO messages
    (guildId, channelId, messageId, userId, content, timestamp, repliedUser)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)
const deleteMessageStmt = msgDb.prepare(`DELETE FROM messages WHERE messageId = ?`)
const updateMessageStmt = msgDb.prepare(`UPDATE messages SET content = ? WHERE messageId = ?`)


export function saveMessage(message:Message, content:string) {
  const repliedUser = message.mentions?.repliedUser?.id ?? null
  const guildId = message.guild?.id ?? null

  insertMessage.run(
    guildId,
    message.channel.id,
    message.id,
    message.author.id,
    content,
    message.createdTimestamp,
    repliedUser ? repliedUser : null
  )
}

export function deleteMessage(message:Message|PartialMessage) {
  if (!message.id) return
  deleteMessageStmt.run(message.id)
}

export function updateMessage(message:Message) {
  const content = formatMsgContent(message)
  updateMessageStmt.run( content, message.id )
}


export function formatMsgContent(message:Message):string|null {
  let content = message.cleanContent?.trim() || ''

  const attachments = [...message.attachments.values()].map(a => a.url.split('?ex=')[0])

  if (!content && attachments.length === 0) return null
  if (attachments.length === 0) return content

  return content ? `${content} ${attachments.join(' ')}` : attachments.join(' ')
}

export function getRandQuote(userId?:string):MessageRow|undefined {
  if (userId) {
    const ids = msgDb.prepare(`SELECT messageId FROM messages WHERE userId = ?`).all(userId) as { messageId:string }[]
    if (!ids.length) return undefined

    const randomId = ids[Math.floor(Math.random() * ids.length)].messageId
    return msgDb.prepare(`SELECT * FROM messages WHERE messageId = ?`).get(randomId) as MessageRow
  } else {
    const ids = msgDb.prepare(`SELECT messageId FROM messages`).all() as { messageId:string }[]
    if (!ids.length) return undefined

    const randomId = ids[Math.floor(Math.random() * ids.length)].messageId
    return msgDb.prepare(`SELECT * FROM messages WHERE messageId = ?`).get(randomId) as MessageRow
  }
}