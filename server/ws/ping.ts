export const name = 'ping'

export default async (peer: any, message: any) => {
  peer.send("pong");
}

