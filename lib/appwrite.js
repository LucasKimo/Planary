import { Client, Account, Avatars } from "react-native-appwrite"

export const client = new Client()
  .setProject('686ba0be00153a5b5f7c')
  .setPlatform('dev.lucas.planary')

export const account = new Account(client)
export const avatars = new Avatars(client)