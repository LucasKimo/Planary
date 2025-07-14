import { Client, Account, Avatars, Databases } from "react-native-appwrite"

export const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1')
  .setProject('686ba0be00153a5b5f7c')
  .setPlatform('dev.lucas.planary')

export const account = new Account(client)
export const avatars = new Avatars(client) 
export const databases = new Databases(client)